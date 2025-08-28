"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Search, Smartphone, Laptop, Battery, Clock } from "lucide-react"

interface Bin {
  id: number
  binCode: string
  locationName: string
  latitude: number
  longitude: number
  wasteTypes: string[]
  status: string
  distance?: number
}

const wasteTypeIcons = {
  smartphone: Smartphone,
  laptop: Laptop,
  phone_battery: Battery,
  laptop_battery: Battery,
}

export default function BinsPage() {
  const [bins, setBins] = useState<Bin[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)

  useEffect(() => {
    // Mock bins data - replace with actual API call
    setBins([
      {
        id: 1,
        binCode: "BIN001",
        locationName: "Downtown Electronics Center",
        latitude: 40.7128,
        longitude: -74.006,
        wasteTypes: ["smartphone", "laptop", "phone_battery"],
        status: "active",
        distance: 0.8,
      },
      {
        id: 2,
        binCode: "BIN002",
        locationName: "University Campus - Tech Building",
        latitude: 40.7589,
        longitude: -73.9851,
        wasteTypes: ["laptop", "smartphone"],
        status: "active",
        distance: 1.2,
      },
      {
        id: 3,
        binCode: "BIN003",
        locationName: "Shopping Mall - Electronics Store",
        latitude: 40.7505,
        longitude: -73.9934,
        wasteTypes: ["smartphone", "phone_battery", "laptop_battery"],
        status: "active",
        distance: 2.1,
      },
      {
        id: 4,
        binCode: "BIN004",
        locationName: "Community Center - Battery Drop",
        latitude: 40.7282,
        longitude: -73.7949,
        wasteTypes: ["phone_battery", "laptop_battery"],
        status: "maintenance",
        distance: 3.5,
      },
    ])
  }, [])

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true)
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })

      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      })
    } catch (error) {
      console.error("Error getting location:", error)
    } finally {
      setIsLoadingLocation(false)
    }
  }

  const filteredBins = bins.filter(
    (bin) =>
      bin.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bin.binCode.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-primary/10 text-primary border-primary/20"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "full":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const openInMaps = (bin: Bin) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${bin.latitude},${bin.longitude}`
    window.open(url, "_blank")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-balance">Find Recycling Bins</h1>
          <p className="text-muted-foreground">Locate the nearest e-waste collection points</p>
        </div>

        {/* Search and Location */}
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by location or bin code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              onClick={getCurrentLocation}
              disabled={isLoadingLocation}
              variant="outline"
              className="gap-2 bg-transparent"
            >
              <Navigation className="h-4 w-4" />
              {isLoadingLocation ? "Locating..." : "Near Me"}
            </Button>
          </div>

          {userLocation && (
            <div className="text-center text-sm text-muted-foreground">
              <MapPin className="inline h-4 w-4 mr-1" />
              Location found - showing distances
            </div>
          )}
        </div>

        {/* Bins List */}
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-4">
            {filteredBins.map((bin) => (
              <Card key={bin.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{bin.locationName}</h3>
                          <p className="text-sm text-muted-foreground">Code: {bin.binCode}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <Badge className={getStatusColor(bin.status)}>
                          {bin.status === "active" ? "Available" : bin.status}
                        </Badge>
                        {bin.distance && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Navigation className="h-3 w-3" />
                            {bin.distance} km away
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium">Accepts:</p>
                        <div className="flex flex-wrap gap-2">
                          {bin.wasteTypes.map((type) => {
                            const IconComponent = wasteTypeIcons[type as keyof typeof wasteTypeIcons] || Smartphone
                            return (
                              <div key={type} className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-xs">
                                <IconComponent className="h-3 w-3" />
                                {type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => openInMaps(bin)}
                        variant="outline"
                        size="sm"
                        className="gap-2 bg-transparent"
                      >
                        <MapPin className="h-4 w-4" />
                        Directions
                      </Button>
                      {bin.status === "active" && (
                        <Button
                          onClick={() => (window.location.href = `/scan?binCode=${bin.binCode}`)}
                          size="sm"
                          className="gap-2"
                        >
                          <Clock className="h-4 w-4" />
                          Use This Bin
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredBins.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No bins found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? "Try adjusting your search terms" : "No recycling bins available in your area"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
