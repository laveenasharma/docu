"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card } from "@/components/ui/card"
import { ZoomIn, ZoomOut, RotateCw, Download, Printer, ChevronLeft, ChevronRight } from "lucide-react"

export function DocumentViewer({ document }) {
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const containerRef = useRef(null)

  // In a real app, this would load the actual document
  // For this demo, we'll use a placeholder
  const documentUrl = "/placeholder.svg?height=800&width=600"

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 10, 200))
  }

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 10, 50))
  }

  const handleRotate = () => {
    setRotation((rotation + 90) % 360)
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  // In a real app, this would handle printing the document
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Slider
            value={[zoom]}
            min={50}
            max={200}
            step={10}
            className="w-28"
            onValueChange={(value) => setZoom(value[0])}
          />
          <Button variant="outline" size="icon" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleRotate}>
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm">
            <Button variant="outline" size="icon" onClick={handlePreviousPage} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button variant="outline" size="icon" onClick={handleNextPage} disabled={currentPage === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Button variant="outline" size="icon" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex justify-center overflow-auto bg-gray-100 rounded-md p-4"
        style={{ height: "calc(100vh - 300px)", minHeight: "500px" }}
      >
        <div
          className="relative transition-all duration-200 ease-in-out"
          style={{
            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            transformOrigin: "center center",
          }}
        >
          {document.type === "pdf" ? (
            <iframe
              src={documentUrl}
              className="border shadow-lg bg-white"
              style={{ width: "600px", height: "800px" }}
            />
          ) : document.type === "img" ? (
            <img
              src={documentUrl || "/placeholder.svg"}
              alt={document.name}
              className="border shadow-lg bg-white"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          ) : (
            <Card
              className="flex items-center justify-center border shadow-lg bg-white p-8"
              style={{ width: "600px", height: "800px" }}
            >
              <div className="text-center">
                <p className="text-lg font-medium mb-2">Preview not available</p>
                <p className="text-sm text-muted-foreground">
                  {document.type.toUpperCase()} files cannot be previewed directly.
                </p>
                <Button className="mt-4">Download to View</Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

