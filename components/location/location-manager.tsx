"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Navigation, Save, ArrowLeft } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { createBrowserClient } from "@/lib/supabase/client"

interface LocationManagerProps {
  onBack: () => void
}

interface LocationData {
  latitude: number
  longitude: number
  address: string
}

export function LocationManager({ onBack }: LocationManagerProps) {
  const [location, setLocation] = useState<LocationData | null>(null)
  const [manualAddress, setManualAddress] = useState("")
  const [loading, setLoading] = useState(false)
  const [gettingLocation, setGettingLocation] = useState(false)
  const supabase = createBrowserClient()

  useEffect(() => {
    loadCurrentLocation()
  }, [])

  const loadCurrentLocation = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase.from("profiles").select("location").eq("id", user.id).single()

      if (profile?.location) {
        setManualAddress(profile.location)
      }
    } catch (error) {
      console.error("Error loading location:", error)
    }
  }

  const getCurrentLocation = () => {
    setGettingLocation(true)

    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by this browser",
        variant: "destructive",
      })
      setGettingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          // In a real implementation, you would use a geocoding service
          // For now, we'll create a mock address
          const address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`

          setLocation({ latitude, longitude, address })
          setManualAddress(address)

          toast({
            title: "Location Found",
            description: "Your current location has been detected",
          })
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to get address for your location",
            variant: "destructive",
          })
        } finally {
          setGettingLocation(false)
        }
      },
      (error) => {
        let message = "Failed to get your location"

        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Location access denied. Please enable location permissions."
            break
          case error.POSITION_UNAVAILABLE:
            message = "Location information is unavailable."
            break
          case error.TIMEOUT:
            message = "Location request timed out."
            break
        }

        toast({
          title: "Location Error",
          description: message,
          variant: "destructive",
        })
        setGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    )
  }

  const saveLocation = async () => {
    if (!manualAddress.trim()) {
      toast({
        title: "Error",
        description: "Please enter a location",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("profiles").update({ location: manualAddress.trim() }).eq("id", user.id)

      if (error) throw error

      toast({
        title: "Success!",
        description: "Your location has been updated",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save location",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-emerald-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <CardTitle className="text-emerald-800">Location Settings</CardTitle>
            <CardDescription>Update your location for better bin recommendations</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Current Location</Label>
          <div className="flex gap-2">
            <Button
              onClick={getCurrentLocation}
              disabled={gettingLocation}
              variant="outline"
              className="border-emerald-200 bg-transparent"
            >
              <Navigation className="w-4 h-4 mr-2" />
              {gettingLocation ? "Getting Location..." : "Use Current Location"}
            </Button>
          </div>
        </div>

        {location && (
          <div className="bg-emerald-50 p-3 rounded-lg">
            <p className="text-sm text-emerald-700">
              <strong>Coordinates:</strong> {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
            </p>
            <p className="text-sm text-emerald-700">
              <strong>Address:</strong> {location.address}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="address">Manual Address</Label>
          <Input
            id="address"
            placeholder="Enter your address or location"
            value={manualAddress}
            onChange={(e) => setManualAddress(e.target.value)}
          />
          <p className="text-xs text-emerald-600">You can also manually enter your address or preferred location</p>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium">Why we need your location:</p>
              <ul className="list-disc list-inside mt-1 space-y-0.5">
                <li>Find the nearest e-waste bins</li>
                <li>Provide accurate directions</li>
                <li>Track regional recycling impact</li>
              </ul>
            </div>
          </div>
        </div>

        <Button
          onClick={saveLocation}
          disabled={loading || !manualAddress.trim()}
          className="w-full bg-emerald-600 hover:bg-emerald-700"
        >
          {loading ? (
            "Saving..."
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Location
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
