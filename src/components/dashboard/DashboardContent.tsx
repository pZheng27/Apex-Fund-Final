import React, { useState, lazy, Suspense } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import PortfolioSummary from "./PortfolioSummary";
import CoinsList from "./CoinsList";
import { User } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Coin {
  id: string;
  name: string;
  image: string;
  acquisitionDate: string;
  purchasePrice: number;
  currentValue: number;
  roi: number;
  description?: string;
  grade?: string;
  mint?: string;
  year?: number;
  isSold: boolean;
  soldPrice?: number;
  soldDate?: Date;
}

interface Transaction {
  id: string;
  coinName: string;
  soldDate: string;
  purchasePrice: number;
  soldPrice: number;
  profit: number;
  profitPercentage: number;
}

interface DashboardContentProps {
  user?: {
    name: string;
    email: string;
  };
}

const DashboardContent = ({
  user = { name: "John Doe", email: "john@example.com" },
}: DashboardContentProps) => {
  const [activeTab, setActiveTab] = useState("performance");
  const [coins, setCoins] = useState<Coin[]>([
    {
      id: "1",
      name: "1879-CC Morgan Dollar",
      image: "https://api.dicebear.com/7.x/shapes/svg?seed=morgan1879cc",
      acquisitionDate: "2023-01-15T00:00:00.000Z",
      purchasePrice: 1200,
      currentValue: 1500,
      roi: 25,
      description: "The 1879-CC Morgan Dollar is a rare coin from the Carson City Mint. Only 756,000 were minted, making it one of the more difficult Morgan Dollars to find.",
      grade: "MS-63",
      mint: "Carson City",
      year: 1879,
      isSold: false
    }
  ]);
  const [cashReserves, setCashReserves] = useState(50000);

  const handleMarkAsSold = (values: any) => {
    const coinIndex = coins.findIndex(coin => coin.id === values.coinId);
    
    if (coinIndex === -1) {
      toast({
        title: "Error",
        description: "Coin not found",
        variant: "destructive",
      });
      return;
    }
    
    const updatedCoins = [...coins];
    updatedCoins[coinIndex] = {
      ...updatedCoins[coinIndex],
      isSold: values.isSold,
      soldPrice: values.isSold ? parseFloat(values.soldPrice) : undefined,
      soldDate: values.isSold ? values.soldDate : undefined,
    };
    
    setCoins(updatedCoins);
    
    toast({
      title: "Success",
      description: values.isSold 
        ? `Coin marked as sold for $${values.soldPrice}` 
        : "Coin marked as not sold",
    });
  };

  const handleNewCoin = (data: any) => {
    const newCoin: Coin = {
      id: Date.now().toString(),
      name: data.name,
      image: data.image ? URL.createObjectURL(data.image) : "https://api.dicebear.com/7.x/shapes/svg?seed=" + Date.now(),
      acquisitionDate: new Date().toISOString(),
      purchasePrice: parseFloat(data.price),
      currentValue: parseFloat(data.marketValue),
      roi: 0,
      isSold: false,
      description: data.description,
    };

    setCoins(prevCoins => [...prevCoins, newCoin]);
    
    toast({
      title: "Success",
      description: "New coin added to your collection",
    });

    setActiveTab("holdings");
  };

  const handleDeleteCoin = (coinId: string) => {
    setCoins(prevCoins => prevCoins.filter(coin => coin.id !== coinId));
    
    toast({
      title: "Success",
      description: "Coin has been deleted",
    });
  };

  const handleUpdateCashReserves = (newAmount: number) => {
    setCashReserves(newAmount);
    toast({
      title: "Success",
      description: `Cash reserves updated to ${new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(newAmount)}`,
    });
  };

  return (
    <div className="w-full h-full bg-background p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <PortfolioSummary 
          coins={coins} 
          cashReserves={cashReserves}
          onUpdateCashReserves={handleUpdateCashReserves}
        />
      </div>

      <Tabs
        defaultValue="performance"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6 w-full justify-start overflow-x-auto">
          <TabsTrigger value="performance" className="px-4 py-2">
            Performance
          </TabsTrigger>
          <TabsTrigger value="holdings" className="px-4 py-2">
            Current Holdings
          </TabsTrigger>
          <TabsTrigger value="transactions" className="px-4 py-2">
            Sold Assets
          </TabsTrigger>
          <TabsTrigger value="settings" className="px-4 py-2">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <Card className="p-6 bg-card">
            <h2 className="text-2xl font-bold mb-4">Performance Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-80 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">ROI Chart</p>
              </div>
              <div className="h-80 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Historical Value Trends</p>
              </div>
              <div className="h-80 bg-muted rounded-lg flex items-center justify-center md:col-span-2">
                <p className="text-muted-foreground">
                  Market Benchmark Comparison
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="holdings">
          <CoinsList 
            coins={coins.filter(coin => !coin.isSold)} 
            onDeleteCoin={handleDeleteCoin}
            onMarkAsSold={(coinId, soldPrice) => {
              const coinIndex = coins.findIndex(coin => coin.id === coinId);
              if (coinIndex !== -1) {
                const updatedCoins = [...coins];
                updatedCoins[coinIndex] = {
                  ...updatedCoins[coinIndex],
                  isSold: true,
                  soldPrice: soldPrice,
                  soldDate: new Date(),
                };
                setCoins(updatedCoins);
                toast({
                  title: "Success",
                  description: `Coin marked as sold for $${soldPrice}`,
                });
              }
            }}
          />
        </TabsContent>

        <TabsContent value="transactions">
          <CoinsList 
            coins={coins.filter(coin => coin.isSold)}
            onDeleteCoin={handleDeleteCoin}
          />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="p-6 bg-card">
            <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium">{user.name}</h3>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Update Profile</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Change your personal information
                </p>
                <div className="h-40 bg-muted/30 rounded-lg flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    Profile form placeholder
                  </p>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Change Password</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Update your password regularly for security
                </p>
                <div className="h-40 bg-muted/30 rounded-lg flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    Password form placeholder
                  </p>
                </div>
              </div>
              <div className="p-4 border rounded-lg md:col-span-2">
                <h3 className="font-medium mb-2">Notification Preferences</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage how you receive updates and alerts
                </p>
                <div className="h-40 bg-muted/30 rounded-lg flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    Notification settings placeholder
                  </p>
                </div>
              </div>
              <div className="p-4 border rounded-lg md:col-span-2">
                <h3 className="font-medium mb-2">Upload New Asset</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add a new coin or collectible to your portfolio
                </p>
                <div className="mt-4">
                  {React.createElement(() => {
                    const AssetUploadForm = React.lazy(
                      () => import("@/components/assets/AssetUploadForm"),
                    );
                    return (
                      <React.Suspense fallback={<div>Loading form...</div>}>
                        <AssetUploadForm onSubmit={handleNewCoin} />
                      </React.Suspense>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardContent;
