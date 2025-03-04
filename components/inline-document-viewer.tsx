"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ZoomIn, ZoomOut, RotateCw, Highlighter, StickyNote, Pencil, Eraser, Save } from "lucide-react"
import { Card } from "@/components/ui/card"

export function InlineDocumentViewer({
  document,
  annotations = [],
  onAddAnnotation = null,
  isFullscreen = false,
  readOnly = true,
}) {
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [activeAnnotationTool, setActiveAnnotationTool] = useState(null)
  const [annotationText, setAnnotationText] = useState("")
  const [annotationColor, setAnnotationColor] = useState("#FFFF00")
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPath, setCurrentPath] = useState([])
  const [tempAnnotation, setTempAnnotation] = useState(null)
  const canvasRef = useRef(null)
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

  const handleAnnotationToolSelect = (tool) => {
    setActiveAnnotationTool(activeAnnotationTool === tool ? null : tool)
    setTempAnnotation(null)
  }

  const handleCanvasClick = (e) => {
    if (!activeAnnotationTool || readOnly) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) * (canvas.width / rect.width)
    const y = (e.clientY - rect.top) * (canvas.height / rect.height)

    if (activeAnnotationTool === "highlight") {
      setTempAnnotation({
        type: "highlight",
        position: { x, y, width: 200, height: 20 },
        color: annotationColor,
      })
    } else if (activeAnnotationTool === "note") {
      setTempAnnotation({
        type: "note",
        position: { x, y },
        color: annotationColor,
        text: "",
      })
    }
  }

  const handleMouseDown = (e) => {
    if (activeAnnotationTool !== "draw" || readOnly) return

    setIsDrawing(true)
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) * (canvas.width / rect.width)
    const y = (e.clientY - rect.top) * (canvas.height / rect.height)

    setCurrentPath([{ x, y }])
  }

  const handleMouseMove = (e) => {
    if (!isDrawing || readOnly) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) * (canvas.width / rect.width)
    const y = (e.clientY - rect.top) * (canvas.height / rect.height)

    setCurrentPath([...currentPath, { x, y }])
  }

  const handleMouseUp = () => {
    if (!isDrawing || readOnly) return

    setIsDrawing(false)
    if (currentPath.length > 1) {
      setTempAnnotation({
        type: "draw",
        path: [...currentPath],
        color: annotationColor,
      })
    }
  }

  const handleSaveAnnotation = () => {
    if (!tempAnnotation || !onAddAnnotation) return

    const finalAnnotation = { ...tempAnnotation }
    if (tempAnnotation.type === "note") {
      finalAnnotation.text = annotationText
    }

    onAddAnnotation(finalAnnotation)
    setTempAnnotation(null)
    setAnnotationText("")
    setActiveAnnotationTool(null)
  }

  const handleCancelAnnotation = () => {
    setTempAnnotation(null)
    setAnnotationText("")
  }

  // Draw document and annotations on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = documentUrl

    img.onload = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Save context state
      ctx.save()

      // Apply rotation
      if (rotation !== 0) {
        ctx.translate(canvas.width / 2, canvas.height / 2)
        ctx.rotate((rotation * Math.PI) / 180)
        ctx.translate(-canvas.width / 2, -canvas.height / 2)
      }

      // Draw document
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // Restore context state
      ctx.restore()

      // Draw saved annotations
      annotations.forEach((anno) => {
        if (anno.type === "highlight") {
          ctx.fillStyle = anno.color || "rgba(255, 255, 0, 0.3)"
          ctx.fillRect(anno.position.x, anno.position.y, anno.position.width, anno.position.height)
        } else if (anno.type === "note") {
          ctx.fillStyle = anno.color || "rgba(0, 0, 255, 0.7)"
          ctx.beginPath()
          ctx.arc(anno.position.x, anno.position.y, 10, 0, 2 * Math.PI)
          ctx.fill()
        } else if (anno.type === "draw" && anno.path) {
          ctx.strokeStyle = anno.color || "#FF0000"
          ctx.lineWidth = 3
          ctx.beginPath()
          anno.path.forEach((point, index) => {
            if (index === 0) {
              ctx.moveTo(point.x, point.y)
            } else {
              ctx.lineTo(point.x, point.y)
            }
          })
          ctx.stroke()
        }
      })

      // Draw temporary annotation
      if (tempAnnotation) {
        if (tempAnnotation.type === "highlight") {
          ctx.fillStyle = tempAnnotation.color || "rgba(255, 255, 0, 0.3)"
          ctx.fillRect(
            tempAnnotation.position.x,
            tempAnnotation.position.y,
            tempAnnotation.position.width,
            tempAnnotation.position.height,
          )
        } else if (tempAnnotation.type === "note") {
          ctx.fillStyle = tempAnnotation.color || "rgba(0, 0, 255, 0.7)"
          ctx.beginPath()
          ctx.arc(tempAnnotation.position.x, tempAnnotation.position.y, 10, 0, 2 * Math.PI)
          ctx.fill()
        } else if (tempAnnotation.type === "draw" && tempAnnotation.path) {
          ctx.strokeStyle = tempAnnotation.color || "#FF0000"
          ctx.lineWidth = 3
          ctx.beginPath()
          tempAnnotation.path.forEach((point, index) => {
            if (index === 0) {
              ctx.moveTo(point.x, point.y)
            } else {
              ctx.lineTo(point.x, point.y)
            }
          })
          ctx.stroke()
        }
      }

      // Draw current path while drawing
      if (isDrawing && currentPath.length > 1) {
        ctx.strokeStyle = annotationColor || "#FF0000"
        ctx.lineWidth = 3
        ctx.beginPath()
        currentPath.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y)
          } else {
            ctx.lineTo(point.x, point.y)
          }
        })
        ctx.stroke()
      }
    }
  }, [rotation, annotations, tempAnnotation, isDrawing, currentPath, annotationColor])

  return (
    <div className="space-y-4">
      {!readOnly && (
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b">
          <div className="flex items-center gap-2">
            <Button
              variant={activeAnnotationTool === "highlight" ? "default" : "outline"}
              size="sm"
              onClick={() => handleAnnotationToolSelect("highlight")}
              className="flex items-center gap-1"
              disabled={readOnly}
            >
              <Highlighter className="h-4 w-4" />
              Highlight
            </Button>
            <Button
              variant={activeAnnotationTool === "note" ? "default" : "outline"}
              size="sm"
              onClick={() => handleAnnotationToolSelect("note")}
              className="flex items-center gap-1"
              disabled={readOnly}
            >
              <StickyNote className="h-4 w-4" />
              Add Note
            </Button>
            <Button
              variant={activeAnnotationTool === "draw" ? "default" : "outline"}
              size="sm"
              onClick={() => handleAnnotationToolSelect("draw")}
              className="flex items-center gap-1"
              disabled={readOnly}
            >
              <Pencil className="h-4 w-4" />
              Draw
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancelAnnotation}
              className="flex items-center gap-1"
              disabled={readOnly || !activeAnnotationTool}
            >
              <Eraser className="h-4 w-4" />
              Cancel
            </Button>

            <Input
              type="color"
              value={annotationColor}
              onChange={(e) => setAnnotationColor(e.target.value)}
              className="w-10 h-8 p-0 border-none"
              disabled={readOnly}
            />
          </div>
        </div>
      )}

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
      </div>

      <div
        ref={containerRef}
        className="flex justify-center overflow-auto bg-gray-100 rounded-md p-4"
        style={{
          height: isFullscreen ? "calc(100vh - 200px)" : "calc(100vh - 400px)",
          minHeight: "400px",
        }}
      >
        <canvas
          ref={canvasRef}
          width={600}
          height={800}
          className="border shadow-lg bg-white cursor-crosshair"
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "center center",
          }}
          onClick={handleCanvasClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      {tempAnnotation && tempAnnotation.type === "note" && (
        <Card className="p-4">
          <h3 className="font-medium mb-2">Add Note</h3>
          <Textarea
            placeholder="Enter your note text..."
            value={annotationText}
            onChange={(e) => setAnnotationText(e.target.value)}
            className="min-h-[100px] mb-4"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancelAnnotation}>
              Cancel
            </Button>
            <Button onClick={handleSaveAnnotation} disabled={!annotationText.trim()}>
              <Save className="h-4 w-4 mr-2" /> Save Note
            </Button>
          </div>
        </Card>
      )}

      {tempAnnotation && (tempAnnotation.type === "highlight" || tempAnnotation.type === "draw") && (
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={handleCancelAnnotation}>
            Cancel
          </Button>
          <Button onClick={handleSaveAnnotation}>
            <Save className="h-4 w-4 mr-2" /> Save Annotation
          </Button>
        </div>
      )}
    </div>
  )
}

