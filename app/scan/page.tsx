"use client"

import { useState, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QrCode, Camera, Type, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ScanPage() {
  const [scanMode, setScanMode] = useState<"camera" | "manual">("camera")
  const [binCode, setBinCode] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const startCamera = useCallback(async () => {
    try {
      setIsScanning(true)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      setIsScanning(false)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setIsScanning(false)
  }, [])

  const handleScan = (code: string) => {
    setBinCode(code)
    stopCamera()
    // Navigate to waste submission with bin code
    window.location.href = `/submit?binCode=${code}`
  }

  const handleManualSubmit = () => {
    if (binCode.trim()) {
      window.location.href = `/submit?binCode=${binCode.trim()}`
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="max-w-md mx-auto space-y-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-balance">Scan Recycling Bin</CardTitle>
              <p className="text-muted-foreground">Scan the QR code on the bin or enter the code manually</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mode Selection */}
              <div className="flex gap-2">
                <Button
                  variant={scanMode === "camera" ? "default" : "outline"}
                  onClick={() => setScanMode("camera")}
                  className="flex-1 gap-2"
                >
                  <Camera className="h-4 w-4" />
                  Camera
                </Button>
                <Button
                  variant={scanMode === "manual" ? "default" : "outline"}
                  onClick={() => setScanMode("manual")}
                  className="flex-1 gap-2"
                >
                  <Type className="h-4 w-4" />
                  Manual
                </Button>
              </div>

              {/* Camera Mode */}
              {scanMode === "camera" && (
                <div className="space-y-4">
                  <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                    {isScanning ? (
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center space-y-2">
                          <QrCode className="h-12 w-12 mx-auto text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Camera preview will appear here</p>
                        </div>
                      </div>
                    )}

                    {/* Scanning overlay */}
                    {isScanning && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-48 h-48 border-2 border-primary rounded-lg">
                          <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
                          <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
                          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
                          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {!isScanning ? (
                      <Button onClick={startCamera} className="flex-1 gap-2">
                        <Camera className="h-4 w-4" />
                        Start Camera
                      </Button>
                    ) : (
                      <Button onClick={stopCamera} variant="outline" className="flex-1 bg-transparent">
                        Stop Camera
                      </Button>
                    )}
                  </div>

                  {/* Mock scan result for demo */}
                  {isScanning && (
                    <div className="text-center">
                      <Button onClick={() => handleScan("BIN001")} variant="outline" className="text-sm">
                        Simulate Scan (BIN001)
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Manual Mode */}
              {scanMode === "manual" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="binCode">Bin Code</Label>
                    <Input
                      id="binCode"
                      placeholder="Enter bin code (e.g., BIN001)"
                      value={binCode}
                      onChange={(e) => setBinCode(e.target.value)}
                      className="text-center text-lg font-mono"
                    />
                  </div>

                  <Button onClick={handleManualSubmit} disabled={!binCode.trim()} className="w-full gap-2">
                    <QrCode className="h-4 w-4" />
                    Continue with Code
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">How to scan:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Point your camera at the QR code on the bin</li>
                <li>• Make sure the code is clearly visible</li>
                <li>• Hold steady until the code is recognized</li>
                <li>• Or enter the bin code manually if needed</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
