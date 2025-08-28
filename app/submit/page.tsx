"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, Camera, MapPin, Smartphone, Laptop, Battery } from "lucide-react"

interface Bin {
  id: number
  binCode: string
  locationName: string
  wasteTypes: string[]
}

const wasteTypeIcons = {
  smartphone: Smartphone,
  laptop: Laptop,
  phone_battery: Battery,
  laptop_battery: Battery,
}

export default function SubmitPage() {
  const searchParams = useSearchParams()
  const binCode = searchParams.get("binCode")

  const [bin, setBin] = useState<Bin | null>(null)
  const [selectedWasteType, setSelectedWasteType] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (binCode) {
      // Mock bin data - replace with actual API call
      setBin({
        id: 1,
        binCode: binCode,
        locationName: "Downtown Electronics Center",
        wasteTypes: ["smartphone", "laptop", "phone_battery", "laptop_battery"],
      })
    }
  }, [binCode])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const calculatePoints = (wasteType: string, qty: number) => {
    const pointsMap = {
      smartphone: 75,
      laptop: 150,
      phone_battery: 100,
      laptop_battery: 125,
    }
    return (pointsMap[wasteType as keyof typeof pointsMap] || 50) * qty
  }

  const handleSubmit = async () => {
    if (!selectedWasteType || !bin) return

    setIsSubmitting(true)

    // Mock submission - replace with actual API call
    setTimeout(() => {
      setIsSubmitting(false)
      const points = calculatePoints(selectedWasteType, quantity)
      // Navigate to success page with submission details
      window.location.href = `/success?points=${points}&wasteType=${selectedWasteType}&binLocation=${encodeURIComponent(bin.locationName)}&txHash=abc123def456`
    }, 2000)
  }

  if (!bin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Loading bin information...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const estimatedPoints = selectedWasteType ? calculatePoints(selectedWasteType, quantity) : 0

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Bin Information */}
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{bin.locationName}</h2>
                  <p className="text-muted-foreground">Bin Code: {bin.binCode}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submission Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-balance">Submit E-Waste</CardTitle>
              <p className="text-muted-foreground">Tell us what you're recycling to earn points</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Waste Type Selection */}
              <div className="space-y-3">
                <Label>What are you recycling?</Label>
                <Select value={selectedWasteType} onValueChange={setSelectedWasteType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select waste type" />
                  </SelectTrigger>
                  <SelectContent>
                    {bin.wasteTypes.map((type) => {
                      const IconComponent = wasteTypeIcons[type as keyof typeof wasteTypeIcons] || Smartphone
                      return (
                        <SelectItem key={type} value={type}>
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            {type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity */}
              <div className="space-y-3">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                  className="w-24"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-3">
                <Label>Verification Photo (Optional)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        variant="outline"
                        onClick={() => {
                          setImage(null)
                          setImagePreview(null)
                        }}
                        className="w-full bg-transparent"
                      >
                        Remove Photo
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <Camera className="h-12 w-12 mx-auto text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Add a photo of your e-waste</p>
                        <p className="text-xs text-muted-foreground">This helps us verify your submission</p>
                      </div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <Label htmlFor="image-upload">
                        <Button variant="outline" className="gap-2 bg-transparent" asChild>
                          <span>
                            <Upload className="h-4 w-4" />
                            Choose Photo
                          </span>
                        </Button>
                      </Label>
                    </div>
                  )}
                </div>
              </div>

              {/* Points Estimate */}
              {selectedWasteType && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Estimated Points</p>
                        <p className="text-sm text-muted-foreground">
                          For {quantity} {selectedWasteType.replace("_", " ")}
                        </p>
                      </div>
                      <Badge className="bg-primary text-primary-foreground text-lg px-3 py-1">
                        +{estimatedPoints} pts
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={!selectedWasteType || isSubmitting}
                className="w-full h-12 text-lg gap-2"
                size="lg"
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <Upload className="h-5 w-5" />
                    Submit E-Waste
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
