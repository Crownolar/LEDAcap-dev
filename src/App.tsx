import React, { useState, useMemo, useRef } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Camera,
  MapPin,
  Upload,
  Download,
  Search,
  Plus,
  BarChart3,
  Map,
  Database,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Package,
  FileText,
  Moon,
  Sun,
  Menu,
  X,
  LogOut,
  Eye,
  EyeOff,
  Trash2,
  MapPinned,
} from "lucide-react";
import type { IconType } from "react-icons";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
// export type StateKey = keyof typeof statesData;

type User = {
  email: string;
  password: string;
  name: string;
  role: string;
};

// type Sample = {
//   id: string;
//   productName: string;
//   brand: string;
//   lga: string;
//   state: string;
//   market: string;
//   leadLevel: number;
//   status: "safe" | "contaminated" | "pending";
//   date: string;
// };

type StateKey = "Kwara" | "Kano" | "Nasarawa" | "Lagos";

const LEDAcap = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState("all");
  const [filterProduct, setFilterProduct] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([
    {
      email: "admin@ledacap.ng",
      password: "admin123",
      name: "Admin User",
      role: "admin",
    },
  ]);

  const productPhotoRef = useRef<HTMLInputElement | null>(null);
  const vendorPhotoRef = useRef<HTMLInputElement | null>(null);
  const excelImportRef = useRef<HTMLInputElement | null>(null);

  interface Coordinates {
    lat: number;
    lng: number;
  }

  interface Sample {
    id: string;
    state: string;
    lga: string;
    productType: ProductTypeKey;
    productName: string;
    brand: string;
    registered: boolean;
    market: string;
    vendorType: string;
    price: number;
    leadLevel: number;
    status: string;
    date: string;
    coordinates: Coordinates;
    collectedBy: string;
    productPhoto: string | null;
    vendorPhoto: string | null;
  }

  interface FormData {
    state: StateKey | "";
    lga: string;
    productType: ProductTypeKey | "";
    productName: string;
    brand: string;
    registered: boolean;
    market: string;
    vendorType: string;
    price: string;
    batchNumber: string;
    coordinates: {
      lat: string;
      lng: string;
    };
    productPhoto: string | null;
    vendorPhoto: string | null;
  }

  const [samples, setSamples] = useState<Sample[]>([
    {
      id: "KW-ILW-A-01-20251012",
      state: "Kwara",
      lga: "Ilorin West",
      productType: "A",
      productName: "Tiró Kohl",
      brand: "Local Brand",
      registered: false,
      market: "Oja Oba Market",
      vendorType: "Street Vendor",
      price: 500,
      leadLevel: 8500,
      status: "contaminated",
      date: "2025-10-12",
      coordinates: { lat: 8.4799, lng: 4.5418 },
      productPhoto: null,
      vendorPhoto: null,
      collectedBy: "Admin User",
    },
    {
      id: "KN-MUN-C-05-20251015",
      state: "Kano",
      lga: "Municipal",
      productType: "C",
      productName: "Face Powder Premium",
      brand: "BeautyGlow",
      registered: true,
      market: "Kurmi Market",
      vendorType: "Retail Shop",
      price: 2500,
      leadLevel: 150,
      status: "safe",
      date: "2025-10-15",
      coordinates: { lat: 12.0022, lng: 8.5919 },
      productPhoto: null,
      vendorPhoto: null,
      collectedBy: "Admin User",
    },
    {
      id: "LG-IKJ-B-03-20251018",
      state: "Lagos",
      lga: "Ikeja",
      productType: "B",
      productName: "Ceremonial Efun",
      brand: "N/A",
      registered: false,
      market: "Computer Village",
      vendorType: "Market Stall",
      price: 800,
      leadLevel: 12000,
      status: "contaminated",
      date: "2025-10-18",
      coordinates: { lat: 6.6018, lng: 3.3515 },
      productPhoto: null,
      vendorPhoto: null,
      collectedBy: "Admin User",
    },
    {
      id: "NS-KRF-D-02-20251010",
      state: "Nasarawa",
      lga: "Keffi",
      productType: "D",
      productName: "Makeup Foundation",
      brand: "GlamFace",
      registered: true,
      market: "Keffi Central Pharmacy",
      vendorType: "Pharmacy",
      price: 3500,
      leadLevel: 90,
      status: "safe",
      date: "2025-10-10",
      coordinates: { lat: 8.8481, lng: 7.8739 },
      productPhoto: null,
      vendorPhoto: null,
      collectedBy: "Admin User",
    },
  ]);

  const [formData, setFormData] = useState<FormData>({
    state: "",
    lga: "",
    productType: "",
    productName: "",
    brand: "",
    registered: false,
    market: "",
    vendorType: "",
    price: "",
    batchNumber: "",
    coordinates: { lat: "", lng: "" },
    productPhoto: null,
    vendorPhoto: null,
  });

  const [selectedSample, setSelectedSample] = useState<Sample | null>(null);

  const statesData = {
    Kwara: [
      "Asa",
      "Baruten",
      "Edu",
      "Ekiti",
      "Ifelodun",
      "Ilorin East",
      "Ilorin South",
      "Ilorin West",
      "Irepodun",
      "Isin",
      "Kaiama",
      "Moro",
      "Offa",
      "Oke Ero",
      "Oyun",
      "Pategi",
    ],
    Kano: [
      "Ajingi",
      "Albasu",
      "Bagwai",
      "Bebeji",
      "Bichi",
      "Bunkure",
      "Dala",
      "Dambatta",
      "Dawakin Kudu",
      "Dawakin Tofa",
      "Doguwa",
      "Fagge",
      "Gabasawa",
      "Garko",
      "Garun Mallam",
      "Gaya",
      "Gezawa",
      "Gwale",
      "Gwarzo",
      "Kabo",
      "Kano Municipal",
      "Karaye",
      "Kibiya",
      "Kiru",
      "Kumbotso",
      "Kunchi",
      "Kura",
      "Madobi",
      "Makoda",
      "Minjibir",
      "Nasarawa",
      "Rano",
      "Rimin Gado",
      "Rogo",
      "Shanono",
      "Sumaila",
      "Takai",
      "Tarauni",
      "Tofa",
      "Tsanyawa",
      "Tudun Wada",
      "Ungogo",
      "Warawa",
      "Wudil",
    ],
    Nasarawa: [
      "Akwanga",
      "Awe",
      "Doma",
      "Karu",
      "Keana",
      "Keffi",
      "Kokona",
      "Lafia",
      "Nasarawa",
      "Nasarawa Egon",
      "Obi",
      "Toto",
      "Wamba",
    ],
    Lagos: [
      "Agege",
      "Ajeromi-Ifelodun",
      "Alimosho",
      "Amuwo-Odofin",
      "Apapa",
      "Badagry",
      "Epe",
      "Eti Osa",
      "Ibeju-Lekki",
      "Ifako-Ijaiye",
      "Ikeja",
      "Ikorodu",
      "Kosofe",
      "Lagos Island",
      "Lagos Mainland",
      "Mushin",
      "Ojo",
      "Oshodi-Isolo",
      "Shomolu",
      "Surulere",
    ],
  } as const;

  type ProductTypeKey = "A" | "B" | "C" | "D" | "E";

  const productTypes: Record<ProductTypeKey, string> = {
    A: "Tiró/Kohl (Unregistered)",
    B: "Ceremonial Powder (Unregistered)",
    C: "Branded Cosmetic 1 (Registered)",
    D: "Branded Cosmetic 2 (Registered)",
    E: "Branded Cosmetic 3 (Registered)",
  };

  const vendorTypes = [
    "Street Vendor",
    "Market Stall",
    "Retail Shop",
    "Pharmacy",
    "Supermarket",
    "Beauty Store",
  ];

  // Authentication functions
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(
      (u) => u.email === authForm.email && u.password === authForm.password
    );
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      setShowAuthModal(false);
      setAuthForm({ email: "", password: "", name: "" });
    } else {
      alert("Invalid credentials!");
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (users.find((u) => u.email === authForm.email)) {
      alert("User already exists!");
      return;
    }
    const newUser = {
      email: authForm.email,
      password: authForm.password,
      name: authForm.name,
      role: "agent",
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    setShowAuthModal(false);
    setAuthForm({ email: "", password: "", name: "" });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentView("dashboard");
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "productPhoto" | "vendorPhoto"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          [type]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (type: "productPhoto" | "vendorPhoto") => {
    setFormData((prev) => ({
      ...prev,
      [type]: null,
    }));

    if (type === "productPhoto" && productPhotoRef.current) {
      productPhotoRef.current.value = "";
    } else if (vendorPhotoRef.current) {
      vendorPhotoRef.current.value = "";
    }
  };

  const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (evt: ProgressEvent<FileReader>) => {
        try {
          const bstr = evt.target?.result;
          if (!bstr) {
            alert("Failed to read file.");
            return;
          }

          const wb = XLSX.read(bstr, { type: "binary" });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];

          // Type hint for sheet_to_json result
          const data = XLSX.utils.sheet_to_json<Record<string, any>>(ws);

          const importedSamples = data.map((row) => ({
            id:
              row.id ||
              generateSampleId(
                row.state,
                row.lga,
                row.productType as ProductTypeKey
              ),
            state: String(row.state || ""),
            lga: String(row.lga || ""),
            productType: (row.productType as ProductTypeKey) || "paint", // Default to one valid key
            productName: String(row.productName || ""),
            brand: String(row.brand || "N/A"),
            registered: row.registered === "Yes" || row.registered === true,
            market: String(row.market || ""),
            vendorType: String(row.vendorType || ""),
            price: parseFloat(row.price) || 0,
            leadLevel: parseFloat(row.leadLevel) || 0,
            status: String(row.status || "pending"),
            date: String(row.date || new Date().toISOString().split("T")[0]),
            coordinates: {
              lat: parseFloat(row.latitude) || 0,
              lng: parseFloat(row.longitude) || 0,
            },
            productPhoto: null,
            vendorPhoto: null,
            collectedBy: currentUser?.name || "Unknown",
          }));

          setSamples((prev) => [...prev, ...importedSamples]);
          alert(`Successfully imported ${importedSamples.length} samples!`);
        } catch (error) {
          alert("Error importing Excel file. Please check the format.");
          console.error(error);
        }
      };

      reader.readAsBinaryString(file);
    }
  };

  const handleExcelExport = () => {
    const exportData = filteredSamples.map((s) => ({
      "Sample ID": s.id,
      State: s.state,
      LGA: s.lga,
      "Product Type": productTypes[s.productType as ProductTypeKey],
      "Product Name": s.productName,
      Brand: s.brand,
      Registered: s.registered ? "Yes" : "No",
      Market: s.market,
      "Vendor Type": s.vendorType,
      "Price (₦)": s.price,
      "Lead Level (ppm)": s.leadLevel,
      Status: s.status.toUpperCase(),
      Date: s.date,
      Latitude: s.coordinates.lat,
      Longitude: s.coordinates.lng,
      "Collected By": s.collectedBy,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Samples");
    XLSX.writeFile(
      wb,
      `LEDAcap_Samples_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  type ReportType = "state" | "contamination" | "product" | "risk";
  // PDF Report Generation
  const generatePDFReport = (reportType: ReportType): void => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(16, 185, 129);
    doc.text("LEDAcap", 20, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Lead Exposure Detection & Capacity Platform", 20, 27);

    doc.setDrawColor(16, 185, 129);
    doc.line(20, 30, 190, 30);

    // Report Title
    doc.setFontSize(16);
    doc.setTextColor(0);
    let yPos = 40;

    switch (reportType) {
      case "state":
        doc.text("State Summary Report", 20, yPos);
        yPos += 10;
        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, yPos);
        yPos += 10;

        analytics.byState.forEach((state) => {
          const stateContaminated = samples.filter(
            (s) => s.state === state.name && s.leadLevel > 1000
          ).length;
          doc.text(
            `${state.name}: ${state.value} samples (${stateContaminated} contaminated)`,
            20,
            yPos
          );
          yPos += 7;
        });
        break;

      case "contamination":
        doc.text("Contamination Analysis Report", 20, yPos);
        yPos += 10;
        doc.setFontSize(10);
        doc.text(`Total Samples: ${analytics.total}`, 20, yPos);
        yPos += 7;
        doc.text(
          `Contaminated: ${analytics.contaminated} (${(
            (analytics.contaminated / analytics.total) *
            100
          ).toFixed(1)}%)`,
          20,
          yPos
        );
        yPos += 7;
        doc.text(
          `Safe: ${analytics.safe} (${(
            (analytics.safe / analytics.total) *
            100
          ).toFixed(1)}%)`,
          20,
          yPos
        );
        yPos += 10;

        doc.text("High-Risk Samples:", 20, yPos);
        yPos += 7;
        const highRisk = samples.filter((s) => s.leadLevel > 5000).slice(0, 10);
        highRisk.forEach((s) => {
          doc.setFontSize(9);
          doc.text(`${s.id}: ${s.productName} - ${s.leadLevel} ppm`, 25, yPos);
          yPos += 6;
        });
        break;

      case "product":
        doc.text("Product Type Report", 20, yPos);
        yPos += 10;
        analytics.byProductType.forEach((pt) => {
          doc.setFontSize(10);
          doc.text(`${pt.name}: ${pt.value} samples`, 20, yPos);
          yPos += 7;
        });
        break;

      case "risk":
        doc.text("Risk Assessment Report", 20, yPos);
        yPos += 10;
        doc.setFontSize(10);

        analytics.registeredVsUnregistered.forEach((category) => {
          doc.text(`${category.name} Products:`, 20, yPos);
          yPos += 7;
          doc.text(`  Total: ${category.total}`, 25, yPos);
          yPos += 6;
          doc.text(`  Contaminated: ${category.contaminated}`, 25, yPos);
          yPos += 6;
          doc.text(
            `  Contamination Rate: ${category.contaminationRate}%`,
            25,
            yPos
          );
          yPos += 10;
        });
        break;
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("LEDAcap © 2025 - Confidential Report", 20, 280);

    doc.save(
      `LEDAcap_${reportType}_Report_${
        new Date().toISOString().split("T")[0]
      }.pdf`
    );
  };

  const generateSampleId = (
    state: string,
    lga: string,
    productType: ProductTypeKey
  ) => {
    const stateCode = state.substring(0, 2).toUpperCase();
    const lgaCode = lga.substring(0, 3).toUpperCase();
    const count =
      samples.filter((s) => s.state === state && s.lga === lga).length + 1;
    const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
    return `${stateCode}-${lgaCode}-${productType}-${String(count).padStart(
      2,
      "0"
    )}-${date}`;
  };

  const analytics = useMemo(() => {
    const total = samples.length;
    const contaminated = samples.filter((s) => s.leadLevel > 1000).length;
    const safe = samples.filter((s) => s.leadLevel <= 1000).length;
    const pending = samples.filter((s) => s.status === "pending").length;

    const byState = samples.reduce<Record<string, number>>((acc, s) => {
      acc[s.state] = (acc[s.state] || 0) + 1;
      return acc;
    }, {});

    const byProductType = samples.reduce<Record<string, number>>((acc, s) => {
      const type = productTypes[s.productType as ProductTypeKey];
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const registeredVsUnregistered = samples.reduce<
      Record<string, { total: number; contaminated: number }>
    >((acc, s) => {
      const key = s.registered ? "Registered" : "Unregistered";
      const contaminated = s.leadLevel > 1000 ? 1 : 0;
      if (!acc[key]) acc[key] = { total: 0, contaminated: 0 };
      acc[key].total++;
      acc[key].contaminated += contaminated;
      return acc;
    }, {});

    return {
      total,
      contaminated,
      safe,
      pending,
      byState: Object.entries(byState).map(([name, value]) => ({
        name,
        value,
      })),
      byProductType: Object.entries(byProductType).map(([name, value]) => ({
        name,
        value,
      })),
      registeredVsUnregistered: Object.entries(registeredVsUnregistered).map(
        ([name, data]) => ({
          name,
          total: data.total,
          contaminated: data.contaminated,
          contaminationRate: ((data.contaminated / data.total) * 100).toFixed(
            1
          ),
        })
      ),
    };
  }, [samples]);

  const filteredSamples = useMemo(() => {
    return samples.filter((sample) => {
      const matchesSearch =
        sample.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sample.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sample.market.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesState =
        filterState === "all" || sample.state === filterState;
      const matchesProduct =
        filterProduct === "all" || sample.productType === filterProduct;
      const matchesStatus =
        filterStatus === "all" || sample.status === filterStatus;

      return matchesSearch && matchesState && matchesProduct && matchesStatus;
    });
  }, [samples, searchTerm, filterState, filterProduct, filterStatus]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const sampleId = generateSampleId(
      formData.state,
      formData.lga,
      formData.productType as ProductTypeKey
    );

    const newSample: Sample = {
      id: sampleId,
      state: formData.state,
      lga: formData.lga,
      productType: formData.productType as ProductTypeKey,
      productName: formData.productName,
      brand: formData.brand,
      registered: formData.registered,
      market: formData.market,
      vendorType: formData.vendorType,
      price: parseFloat(formData.price) || 0,
      leadLevel: 0,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      coordinates: {
        lat: parseFloat(formData.coordinates.lat) || 0,
        lng: parseFloat(formData.coordinates.lng) || 0,
      },
      productPhoto: formData.productPhoto || null,
      vendorPhoto: formData.vendorPhoto || null,
      collectedBy: currentUser?.name || "Unknown",
    };

    setSamples((prevSamples) => [...prevSamples, newSample]);
    setShowForm(false);

    // Reset form
    setFormData({
      state: "",
      lga: "",
      productType: "",
      productName: "",
      brand: "",
      registered: false,
      market: "",
      vendorType: "",
      price: "",
      batchNumber: "",
      coordinates: { lat: "", lng: "" },
      productPhoto: null,
      vendorPhoto: null,
    });
  };

  const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"];

  const theme = {
    bg: darkMode ? "bg-gray-900" : "bg-gray-50",
    card: darkMode ? "bg-gray-800" : "bg-white",
    text: darkMode ? "text-gray-100" : "text-gray-900",
    textMuted: darkMode ? "text-gray-400" : "text-gray-600",
    border: darkMode ? "border-gray-700" : "border-gray-200",
    input: darkMode
      ? "bg-gray-700 border-gray-600 text-gray-100"
      : "bg-white border-gray-300 text-gray-900",
    hover: darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100",
  };

  interface StatCardProps {
    icon: IconType;
    label: string;
    value: string | number;
    color: string;
    subtext?: string;
    theme?: {
      card: string;
      border: string;
      text: string;
      textMuted: string;
    };
  }

  const StatCard: React.FC<StatCardProps> = ({
    icon: Icon,
    label,
    value,
    color,
    subtext,
    theme,
  }) => (
    <div
      className={`${theme?.card || ""} rounded-lg shadow-md p-6 border ${
        theme?.border || ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm ${theme?.textMuted || ""} font-medium`}>
            {label}
          </p>
          <p className={`text-3xl font-bold mt-2 ${theme?.text || ""}`}>
            {value}
          </p>
          {subtext && (
            <p className={`text-xs ${theme?.textMuted || ""} mt-1`}>
              {subtext}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );

  interface NavItemProps {
    icon: IconType;
    label: string;
    view: string;
    badge?: string | number;
  }

  const NavItem: React.FC<NavItemProps> = ({
    icon: Icon,
    label,
    view,
    badge,
  }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setMobileMenuOpen(false);
      }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        currentView === view
          ? darkMode
            ? "bg-emerald-600 text-white"
            : "bg-emerald-500 text-white"
          : `${theme.text} ${theme.hover}`
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
      {badge && (
        <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );

  // Show authentication modal if not authenticated
  if (!isAuthenticated) {
    return (
      <div
        className={`min-h-screen ${theme.bg} flex items-center justify-center p-4`}
      >
        <div
          className={`${theme.card} rounded-lg shadow-xl max-w-md w-full p-8 border ${theme.border}`}
        >
          <div className="text-center mb-8">
            <div className="bg-emerald-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">LEDAcap</h1>
            <p className={`text-sm ${theme.textMuted}`}>
              Lead Exposure Detection & Capacity Platform
            </p>
          </div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setAuthMode("login")}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                authMode === "login"
                  ? "bg-emerald-500 text-white"
                  : `${theme.hover}`
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setAuthMode("signup")}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                authMode === "signup"
                  ? "bg-emerald-500 text-white"
                  : `${theme.hover}`
              }`}
            >
              Sign Up
            </button>
          </div>

          <form
            onSubmit={authMode === "login" ? handleLogin : handleSignup}
            className="space-y-4"
          >
            {authMode === "signup" && (
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${theme.text}`}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={authForm.name}
                  onChange={(e) =>
                    setAuthForm({ ...authForm, name: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg ${theme.input}`}
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label className={`block text-sm font-medium mb-2 ${theme.text}`}>
                Email
              </label>
              <input
                type="email"
                required
                value={authForm.email}
                onChange={(e) =>
                  setAuthForm({ ...authForm, email: e.target.value })
                }
                className={`w-full px-4 py-2 border rounded-lg ${theme.input}`}
                placeholder="user@ledacap.ng"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${theme.text}`}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={authForm.password}
                  onChange={(e) =>
                    setAuthForm({ ...authForm, password: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg ${theme.input}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme.textMuted}`}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-lg transition-colors"
            >
              {authMode === "login" ? "Login" : "Sign Up"}
            </button>
          </form>

          {authMode === "login" && (
            <div className="mt-4 p-3 bg-blue-500 bg-opacity-10 border border-blue-500 rounded-lg">
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Demo: admin@ledacap.ng / admin123
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text}`}>
      <header
        className={`${theme.card} shadow-sm border-b ${theme.border} sticky top-0 z-40`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500 p-2 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">LEDAcap</h1>
                <p className={`text-xs ${theme.textMuted}`}>
                  Lead Exposure Detection & Capacity Platform
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-lg ${theme.card} border ${theme.border}`}
              >
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {currentUser?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="text-sm">
                  <p className="font-medium">{currentUser?.name}</p>
                  <p className={`text-xs ${theme.textMuted}`}>
                    {currentUser?.role}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${theme.hover} transition-colors`}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={handleLogout}
                className={`p-2 rounded-lg ${theme.hover} transition-colors`}
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden p-2 rounded-lg ${theme.hover}`}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {mobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          <aside
            className={`
            fixed lg:sticky top-0 left-0 h-full lg:h-fit z-50 lg:z-0
            w-64 lg:w-64
            ${theme.card} shadow-xl lg:shadow-md border-r lg:border ${
              theme.border
            }
            p-4 lg:rounded-lg lg:top-24
            transform transition-transform duration-300 ease-in-out
            ${
              mobileMenuOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
          `}
          >
            <nav className="space-y-2">
              <NavItem icon={BarChart3} label="Dashboard" view="dashboard" />
              <NavItem
                icon={Database}
                label="Sample Database"
                view="database"
              />
              <NavItem icon={Map} label="Geographic View" view="map" />
              <NavItem icon={FileText} label="Reports" view="reports" />
              <NavItem icon={Users} label="Field Agents" view="agents" />
            </nav>

            <div className="mt-6 pt-6 border-t border-gray-700 space-y-2">
              <button
                onClick={() => {
                  setShowForm(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                New Sample
              </button>

              <button
                onClick={() => excelImportRef.current?.click()}
                className={`w-full border ${theme.border} font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${theme.hover}`}
              >
                <Upload className="w-5 h-5" />
                Import Excel
              </button>
              <input
                ref={excelImportRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleExcelImport}
                className="hidden"
              />
            </div>
          </aside>

          <main className="flex-1">
            {currentView === "dashboard" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    icon={Package}
                    label="Total Samples"
                    value={analytics.total}
                    color="bg-blue-500"
                  />
                  <StatCard
                    icon={AlertTriangle}
                    label="Contaminated"
                    value={analytics.contaminated}
                    color="bg-red-500"
                    subtext={`${(
                      (analytics.contaminated / analytics.total) *
                      100
                    ).toFixed(1)}% of total`}
                  />
                  <StatCard
                    icon={CheckCircle}
                    label="Safe Products"
                    value={analytics.safe}
                    color="bg-green-500"
                    subtext={`${(
                      (analytics.safe / analytics.total) *
                      100
                    ).toFixed(1)}% of total`}
                  />
                  <StatCard
                    icon={Clock}
                    label="Pending Tests"
                    value={analytics.pending}
                    color="bg-yellow-500"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div
                    className={`${theme.card} rounded-lg shadow-md p-6 border ${theme.border}`}
                  >
                    <h3 className={`text-lg font-semibold mb-4 ${theme.text}`}>
                      Samples by State
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.byState}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={darkMode ? "#374151" : "#e5e7eb"}
                        />
                        <XAxis
                          dataKey="name"
                          stroke={darkMode ? "#9ca3af" : "#6b7280"}
                        />
                        <YAxis stroke={darkMode ? "#9ca3af" : "#6b7280"} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: darkMode ? "#1f2937" : "#fff",
                            border: `1px solid ${
                              darkMode ? "#374151" : "#e5e7eb"
                            }`,
                            borderRadius: "8px",
                          }}
                        />
                        <Bar dataKey="value" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div
                    className={`${theme.card} rounded-lg shadow-md p-6 border ${theme.border}`}
                  >
                    <h3 className={`text-lg font-semibold mb-4 ${theme.text}`}>
                      Product Type Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={analytics.byProductType}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({
                            name,
                            percent,
                          }: {
                            name?: string;
                            percent?: number;
                          }) =>
                            `${name?.split(" ")[0]}: ${(
                              (percent ?? 0) * 100
                            ).toFixed(0)}%`
                          }
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {analytics.byProductType.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: darkMode ? "#1f2937" : "#fff",
                            border: `1px solid ${
                              darkMode ? "#374151" : "#e5e7eb"
                            }`,
                            borderRadius: "8px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div
                    className={`${theme.card} rounded-lg shadow-md p-6 border ${theme.border} lg:col-span-2`}
                  >
                    <h3 className={`text-lg font-semibold mb-4 ${theme.text}`}>
                      Contamination: Registered vs Unregistered
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.registeredVsUnregistered}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={darkMode ? "#374151" : "#e5e7eb"}
                        />
                        <XAxis
                          dataKey="name"
                          stroke={darkMode ? "#9ca3af" : "#6b7280"}
                        />
                        <YAxis stroke={darkMode ? "#9ca3af" : "#6b7280"} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: darkMode ? "#1f2937" : "#fff",
                            border: `1px solid ${
                              darkMode ? "#374151" : "#e5e7eb"
                            }`,
                            borderRadius: "8px",
                          }}
                        />
                        <Legend />
                        <Bar
                          dataKey="total"
                          fill="#3b82f6"
                          name="Total Samples"
                        />
                        <Bar
                          dataKey="contaminated"
                          fill="#ef4444"
                          name="Contaminated"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {currentView === "database" && (
              <div className="space-y-4">
                <div
                  className={`${theme.card} rounded-lg shadow-md border ${theme.border} p-3 sm:p-4 md:p-6 w-full max-w-full overflow-x-auto`}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {/* Search Input */}
                    <div className="relative w-full max-w-full sm:max-w-[100%]">
                      <Search
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme.textMuted}`}
                      />
                      <input
                        type="text"
                        placeholder="Search samples..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg ${theme.input} focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base`}
                      />
                    </div>

                    {/* State Filter */}
                    <div className="w-full max-w-full sm:max-w-[100%]">
                      <select
                        value={filterState}
                        onChange={(e) => setFilterState(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg ${theme.input} focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base`}
                      >
                        <option value="all">All States</option>
                        {Object.keys(statesData).map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Product Filter */}
                    <div className="w-full max-w-full sm:max-w-[100%]">
                      <select
                        value={filterProduct}
                        onChange={(e) => setFilterProduct(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg ${theme.input} focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base`}
                      >
                        <option value="all">All Products</option>
                        {Object.entries(productTypes).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Status Filter */}
                    <div className="w-full max-w-full sm:max-w-[100%]">
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg ${theme.input} focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base`}
                      >
                        <option value="all">All Status</option>
                        <option value="safe">Safe</option>
                        <option value="contaminated">Contaminated</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleExcelExport}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Export Excel
                    </button>
                  </div>
                </div>

                {/* Table Card */}
                <div
                  className={`${theme.card} rounded-lg shadow-md border ${theme.border} overflow-hidden w-full`}
                >
                  {/* Desktop Table */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full min-w-[700px] text-sm">
                      <thead
                        className={darkMode ? "bg-gray-700" : "bg-gray-50"}
                      >
                        <tr>
                          {[
                            "Sample ID",
                            "Product",
                            "Location",
                            "Lead Level (ppm)",
                            "Status",
                            "Date",
                            "Actions",
                          ].map((header) => (
                            <th
                              key={header}
                              className={`px-4 py-3 text-left font-medium ${theme.textMuted} uppercase tracking-wider`}
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredSamples.map((sample) => (
                          <tr key={sample.id} className={theme.hover}>
                            <td className="px-4 py-3 whitespace-nowrap font-medium">
                              {sample.id}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div>
                                <div className="font-medium">
                                  {sample.productName}
                                </div>
                                <div className={`text-xs ${theme.textMuted}`}>
                                  {sample.brand}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div>
                                <div>
                                  {sample.lga}, {sample.state}
                                </div>
                                <div className={`text-xs ${theme.textMuted}`}>
                                  {sample.market}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap font-semibold">
                              <span
                                className={
                                  sample.leadLevel > 1000
                                    ? "text-red-500"
                                    : "text-green-500"
                                }
                              >
                                {sample.leadLevel.toLocaleString()}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                  sample.status === "safe"
                                    ? "bg-green-100 text-green-800"
                                    : sample.status === "contaminated"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {sample.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {sample.date}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <button
                                onClick={() => setSelectedSample(sample)}
                                className="text-emerald-500 hover:text-emerald-600 font-medium"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card Layout */}
                  <div className="block sm:hidden space-y-4 p-2">
                    {filteredSamples.map((sample) => (
                      <div
                        key={sample.id}
                        className={`${theme.card} border ${theme.border} rounded-lg p-3 shadow-sm`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-semibold text-gray-500">
                            Sample ID
                          </span>
                          <span className="text-sm font-medium">
                            {sample.id}
                          </span>
                        </div>

                        <div className="text-sm mb-1">
                          <span className="font-semibold">Product:</span>{" "}
                          {sample.productName}{" "}
                          <span className={`block text-xs ${theme.textMuted}`}>
                            {sample.brand}
                          </span>
                        </div>

                        <div className="text-sm mb-1">
                          <span className="font-semibold">Location:</span>{" "}
                          {sample.lga}, {sample.state}
                          <div className={`text-xs ${theme.textMuted}`}>
                            {sample.market}
                          </div>
                        </div>

                        <div className="text-sm mb-1">
                          <span className="font-semibold">Lead Level:</span>{" "}
                          <span
                            className={`font-semibold ${
                              sample.leadLevel > 1000
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          >
                            {sample.leadLevel.toLocaleString()} ppm
                          </span>
                        </div>

                        <div className="text-sm mb-1">
                          <span className="font-semibold">Status:</span>{" "}
                          <span
                            className={`px-2 py-[2px] text-xs font-semibold rounded-full ${
                              sample.status === "safe"
                                ? "bg-green-100 text-green-800"
                                : sample.status === "contaminated"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {sample.status.toUpperCase()}
                          </span>
                        </div>

                        <div className="text-sm mb-1">
                          <span className="font-semibold">Date:</span>{" "}
                          {sample.date}
                        </div>

                        <button
                          onClick={() => setSelectedSample(sample)}
                          className="mt-2 text-emerald-500 hover:text-emerald-600 text-sm font-medium"
                        >
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentView === "map" && (
              <div
                className={`${theme.card} rounded-lg shadow-md p-6 border ${theme.border}`}
              >
                <h2 className="text-xl font-semibold mb-4">
                  Geographic Distribution
                </h2>
                <div className="space-y-4">
                  {samples
                    .filter((s) => s.coordinates.lat && s.coordinates.lng)
                    .map((sample) => (
                      <div
                        key={sample.id}
                        className={`p-4 border ${theme.border} rounded-lg flex items-start gap-4`}
                      >
                        <MapPinned
                          className={`w-6 h-6 mt-1 ${
                            sample.leadLevel > 1000
                              ? "text-red-500"
                              : "text-green-500"
                          }`}
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">
                                {sample.productName}
                              </h3>
                              <p className={`text-sm ${theme.textMuted}`}>
                                {sample.market}, {sample.lga}, {sample.state}
                              </p>
                              <p className={`text-xs ${theme.textMuted} mt-1`}>
                                Coordinates: {sample.coordinates.lat},{" "}
                                {sample.coordinates.lng}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                sample.leadLevel > 1000
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {sample.leadLevel} ppm
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                  {samples.filter((s) => s.coordinates.lat && s.coordinates.lng)
                    .length === 0 && (
                    <div className="text-center py-12">
                      <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className={theme.textMuted}>
                        No samples with GPS coordinates yet
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentView === "reports" && (
              <div
                className={`${theme.card} rounded-lg shadow-md p-6 border ${theme.border}`}
              >
                <h2 className="text-xl font-semibold mb-4">Generate Reports</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => generatePDFReport("state")}
                      className="p-6 border-2 border-emerald-500 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors text-left"
                    >
                      <FileText className="w-8 h-8 text-emerald-500 mb-2" />
                      <h3 className="font-semibold mb-1">
                        State Summary Report
                      </h3>
                      <p className={`text-sm ${theme.textMuted}`}>
                        Comprehensive analysis by state
                      </p>
                    </button>
                    <button
                      onClick={() => generatePDFReport("contamination")}
                      className="p-6 border-2 border-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left"
                    >
                      <BarChart3 className="w-8 h-8 text-blue-500 mb-2" />
                      <h3 className="font-semibold mb-1">
                        Contamination Analysis
                      </h3>
                      <p className={`text-sm ${theme.textMuted}`}>
                        Detailed lead level statistics
                      </p>
                    </button>
                    <button
                      onClick={() => generatePDFReport("product")}
                      className="p-6 border-2 border-purple-500 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-left"
                    >
                      <Package className="w-8 h-8 text-purple-500 mb-2" />
                      <h3 className="font-semibold mb-1">
                        Product Type Report
                      </h3>
                      <p className={`text-sm ${theme.textMuted}`}>
                        Analysis by product category
                      </p>
                    </button>
                    <button
                      onClick={() => generatePDFReport("risk")}
                      className="p-6 border-2 border-orange-500 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors text-left"
                    >
                      <AlertTriangle className="w-8 h-8 text-orange-500 mb-2" />
                      <h3 className="font-semibold mb-1">Risk Assessment</h3>
                      <p className={`text-sm ${theme.textMuted}`}>
                        High-risk products and areas
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {currentView === "agents" && (
              <div
                className={`${theme.card} rounded-lg shadow-md p-6 border ${theme.border}`}
              >
                <h2 className="text-xl font-semibold mb-4">Field Agents</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {["Kwara", "Kano", "Nasarawa", "Lagos"].map((state, idx) => (
                    <div
                      key={state}
                      className={`p-4 border ${theme.border} rounded-lg`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                          {state[0]}
                        </div>
                        <div>
                          <h3 className="font-semibold">Agent {idx + 1}</h3>
                          <p className={`text-sm ${theme.textMuted}`}>
                            {state} State
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className={theme.textMuted}>
                            Samples Collected:
                          </span>
                          <span className="font-semibold">
                            {samples.filter((s) => s.state === state).length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={theme.textMuted}>Status:</span>
                          <span className="text-green-500 font-semibold">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
      {/* Sample Entry Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div
            className={`${theme.card} rounded-lg shadow-xl max-w-4xl w-full my-8 border ${theme.border} mx-auto sm:mx-2`}
          >
            {/* Header */}
            <div className={`p-4 sm:p-6 border-b ${theme.border}`}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-center sm:text-left w-full sm:w-auto">
                  New Sample Entry
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className={`p-2 rounded-lg ${theme.hover}`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-6 max-h-[70vh] overflow-y-auto"
            >
              <div>
                <h3 className="text-lg font-semibold mb-4 text-emerald-500">
                  Location Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${theme.text}`}
                    >
                      State *
                    </label>
                    <select
                      required
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          state: e.target.value as StateKey | "",
                          lga: "",
                        })
                      }
                      className={`w-full px-4 py-2 border rounded-lg ${theme.input} focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                    >
                      <option value="">Select State</option>
                      {Object.keys(statesData).map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${theme.text}`}
                    >
                      LGA *
                    </label>
                    <select
                      required
                      value={formData.lga}
                      onChange={(e) =>
                        setFormData({ ...formData, lga: e.target.value })
                      }
                      disabled={!formData.state}
                      className={`w-full px-4 py-2 border rounded-lg ${theme.input} focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50`}
                    >
                      <option value="">Select LGA</option>
                      {formData.state &&
                        statesData[formData.state].map((lga) => (
                          <option key={lga} value={lga}>
                            {lga}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${theme.text}`}
                    >
                      Market Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.market}
                      onChange={(e) =>
                        setFormData({ ...formData, market: e.target.value })
                      }
                      className={`w-full px-4 py-2 border rounded-lg ${theme.input} focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                      placeholder="e.g., Oja Oba Market"
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${theme.text}`}
                    >
                      Vendor Type *
                    </label>
                    <select
                      required
                      value={formData.vendorType}
                      onChange={(e) =>
                        setFormData({ ...formData, vendorType: e.target.value })
                      }
                      className={`w-full px-4 py-2 border rounded-lg ${theme.input} focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                    >
                      <option value="">Select Vendor Type</option>
                      {vendorTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${theme.text}`}
                    >
                      GPS Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.coordinates.lat}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          coordinates: {
                            ...formData.coordinates,
                            lat: e.target.value,
                          },
                        })
                      }
                      className={`w-full px-4 py-2 border rounded-lg ${theme.input} focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                      placeholder="e.g., 8.4799"
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${theme.text}`}
                    >
                      GPS Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.coordinates.lng}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          coordinates: {
                            ...formData.coordinates,
                            lng: e.target.value,
                          },
                        })
                      }
                      className={`w-full px-4 py-2 border rounded-lg ${theme.input} focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                      placeholder="e.g., 4.5418"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-emerald-500">
                  Product Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${theme.text}`}
                    >
                      Product Type *
                    </label>
                    <select
                      required
                      value={formData.productType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          productType: e.target.value as ProductTypeKey | "",
                        })
                      }
                      className={`w-full px-4 py-2 border rounded-lg ${theme.input} focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                    >
                      <option value="">Select Product Type</option>
                      {Object.entries(productTypes).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${theme.text}`}
                    >
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.productName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          productName: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-2 border rounded-lg ${theme.input} focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                      placeholder="e.g., Tiró Kohl"
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${theme.text}`}
                    >
                      Brand Name
                    </label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) =>
                        setFormData({ ...formData, brand: e.target.value })
                      }
                      className={`w-full px-4 py-2 border rounded-lg ${theme.input} focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                      placeholder="e.g., BeautyGlow or N/A"
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${theme.text}`}
                    >
                      Batch Number
                    </label>
                    <input
                      type="text"
                      value={formData.batchNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          batchNumber: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-2 border rounded-lg ${theme.input} focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                      placeholder="e.g., BT2025001"
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${theme.text}`}
                    >
                      Price (₦) *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className={`w-full px-4 py-2 border rounded-lg ${theme.input} focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                      placeholder="e.g., 500"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="registered"
                      checked={formData.registered}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          registered: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500"
                    />
                    <label
                      htmlFor="registered"
                      className={`ml-2 text-sm font-medium ${theme.text}`}
                    >
                      Registered Product (NAFDAC/SON)
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-emerald-500">
                  Documentation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* === PRODUCT PHOTO === */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${theme.text}`}
                    >
                      Product Photo
                    </label>

                    {formData.productPhoto ? (
                      <div className="relative">
                        <img
                          src={formData.productPhoto} // ✅ Base64 works directly
                          alt="Product"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto("productPhoto")}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => productPhotoRef.current?.click()}
                        className={`border-2 border-dashed ${theme.border} rounded-lg p-8 text-center ${theme.hover} cursor-pointer`}
                      >
                        <Camera
                          className={`w-12 h-12 mx-auto mb-2 ${theme.textMuted}`}
                        />
                        <p className={`text-sm ${theme.textMuted}`}>
                          Click to upload
                        </p>
                      </div>
                    )}

                    <input
                      ref={productPhotoRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, "productPhoto")}
                    />
                  </div>

                  {/* === VENDOR STALL PHOTO === */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${theme.text}`}
                    >
                      Vendor Stall Photo
                    </label>

                    {formData.vendorPhoto ? (
                      <div className="relative">
                        <img
                          src={formData.vendorPhoto}
                          alt="Vendor"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto("vendorPhoto")}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => vendorPhotoRef.current?.click()}
                        className={`border-2 border-dashed ${theme.border} rounded-lg p-8 text-center ${theme.hover} cursor-pointer`}
                      >
                        <Camera
                          className={`w-12 h-12 mx-auto mb-2 ${theme.textMuted}`}
                        />
                        <p className={`text-sm ${theme.textMuted}`}>
                          Click to upload
                        </p>
                      </div>
                    )}

                    <input
                      ref={vendorPhotoRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, "vendorPhoto")}
                    />
                  </div>
                </div>
              </div>

              {formData.state && formData.lga && formData.productType && (
                <div className="bg-emerald-500 bg-opacity-10 border border-emerald-500 rounded-lg p-4">
                  <p className={`text-sm ${theme.textMuted} mb-1`}>
                    Generated Sample ID:
                  </p>
                  <p className="text-xl font-mono font-bold text-emerald-500">
                    {generateSampleId(
                      formData.state,
                      formData.lga,
                      formData.productType
                    )}
                  </p>
                </div>
              )}

              <div className="flex gap-4 pt-4 border-t ${theme.border}">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className={`flex-1 px-6 py-3 border ${theme.border} rounded-lg font-medium ${theme.hover} transition-colors`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
                >
                  Save Sample
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Sample Detail Modal */}
      {selectedSample && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            className={`${theme.card} rounded-xl shadow-2xl w-full max-w-3xl max-h-[100vh] flex flex-col overflow-hidden`}
          >
            {/* Header */}
            <div
              className={`p-3 sm:p-4 md:p-6 border-b ${theme.border} flex items-center justify-between`}
            >
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold break-words leading-tight">
                  {selectedSample.productName}
                </h2>
                <p
                  className={`text-xs sm:text-sm ${theme.textMuted} mt-1 truncate`}
                >
                  {selectedSample.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedSample(null)}
                className={`p-2 rounded-lg ${theme.hover} flex-shrink-0`}
                aria-label="Close"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            <div className="overflow-y-auto p-4 flex-1">
              {/* Body */}
              <div className="p-3 sm:p-4 md:p-6 space-y-6 bg-transparent">
                {/* Information Grids */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Sample Information */}
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-3 text-emerald-500">
                      Sample Information
                    </h3>
                    <div className="space-y-2 text-sm sm:text-base">
                      {[
                        [
                          "Product Type:",
                          productTypes[selectedSample.productType],
                        ],
                        ["Brand:", selectedSample.brand],
                        [
                          "Registered:",
                          selectedSample.registered ? "Yes (NAFDAC/SON)" : "No",
                        ],
                        ["Price:", `₦${selectedSample.price.toLocaleString()}`],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="flex justify-between flex-wrap gap-x-2 text-xs sm:text-sm"
                        >
                          <span className={`${theme.textMuted} min-w-[110px]`}>
                            {label}
                          </span>
                          <span className="font-medium text-right break-words">
                            {value}
                          </span>
                        </div>
                      ))}

                      <div className="flex justify-between flex-wrap gap-x-2 text-xs sm:text-sm">
                        <span className={theme.textMuted}>Lead Level:</span>
                        <span
                          className={`font-bold ${
                            selectedSample.leadLevel > 1000
                              ? "text-red-500"
                              : "text-green-500"
                          }`}
                        >
                          {selectedSample.leadLevel.toLocaleString()} ppm
                        </span>
                      </div>

                      <div className="flex justify-between flex-wrap gap-x-2 text-xs sm:text-sm">
                        <span className={theme.textMuted}>Status:</span>
                        <span
                          className={`px-2 py-1 text-[10px] sm:text-xs font-semibold rounded-full ${
                            selectedSample.status === "safe"
                              ? "bg-green-100 text-green-800"
                              : selectedSample.status === "contaminated"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {selectedSample.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Location Details */}
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-3 text-emerald-500">
                      Location Details
                    </h3>
                    <div className="space-y-2 text-sm sm:text-base">
                      {[
                        ["State:", selectedSample.state],
                        ["LGA:", selectedSample.lga],
                        ["Market:", selectedSample.market],
                        ["Vendor Type:", selectedSample.vendorType],
                        ["Collection Date:", selectedSample.date],
                        ["Collected By:", selectedSample.collectedBy],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="flex justify-between flex-wrap gap-x-2 text-xs sm:text-sm"
                        >
                          <span className={`${theme.textMuted} min-w-[110px]`}>
                            {label}
                          </span>
                          <span className="font-medium text-right break-words">
                            {value}
                          </span>
                        </div>
                      ))}

                      {selectedSample.coordinates.lat &&
                        selectedSample.coordinates.lng && (
                          <div className="flex justify-between flex-wrap gap-x-2 text-xs sm:text-sm">
                            <span className={theme.textMuted}>GPS:</span>
                            <span className="font-medium text-xs text-right break-words">
                              {selectedSample.coordinates.lat},{" "}
                              {selectedSample.coordinates.lng}
                            </span>
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                {/* Photos */}
                {(selectedSample.productPhoto ||
                  selectedSample.vendorPhoto) && (
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-3 text-emerald-500">
                      Documentation
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {selectedSample.productPhoto && (
                        <div>
                          <p
                            className={`text-xs sm:text-sm ${theme.textMuted} mb-2`}
                          >
                            Product Photo
                          </p>
                          <img
                            src={selectedSample.productPhoto}
                            alt="Product"
                            className="w-full h-44 sm:h-56 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      {selectedSample.vendorPhoto && (
                        <div>
                          <p
                            className={`text-xs sm:text-sm ${theme.textMuted} mb-2`}
                          >
                            Vendor Stall Photo
                          </p>
                          <img
                            src={selectedSample.vendorPhoto}
                            alt="Vendor"
                            className="w-full h-44 sm:h-56 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Warning Box */}
                {selectedSample.leadLevel > 1000 && (
                  <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-3 sm:p-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-red-600 dark:text-red-400 mb-1 text-sm sm:text-base">
                          Contaminated Product Alert
                        </h4>
                        <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">
                          This product exceeds safe lead levels (1000 ppm).
                          Immediate action required. Do not use or distribute
                          this product.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LEDAcap;
