"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Pencil, Highlighter, StickyNote, Eraser, Send, MessageSquare } from "lucide-react"

export function DocumentAnnotations({ document }) {
  const [activeTab, setActiveTab] = useState("view")
  const [activeAnnotationTool, setActiveAnnotationTool] = useState(null)
  const [annotations, setAnnotations] = useState([
    {
      id: "anno-1",
      type: "highlight",
      position: { x: 150, y: 200, width: 200, height: 20 },
      color: "yellow",
      author: "John Smith",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      comments: [
        {
          id: "comment-1",
          author: "John Smith",
          text: "This section needs to be updated with the latest figures.",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: "comment-2",
          author: "Sarah Johnson",
          text: "I'll update this by tomorrow.",
          createdAt: new Date(Date.now() - 43200000).toISOString(),
        },
      ],
    },
    {
      id: "anno-2",
      type: "note",
      position: { x: 300, y: 400 },
      color: "blue",
      text: "Please verify this calculation.",
      author: "Michael Brown",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      comments: [],
    },
  ])
  const [newComment, setNewComment] = useState("")
  const [selectedAnnotation, setSelectedAnnotation] = useState(null)
  const canvasRef = useRef(null)

  // In a real app, this would load the actual document
  // For this demo, we'll use a placeholder
  const documentUrl = "/placeholder.svg?height=800&width=600"

  const handleAnnotationToolSelect = (tool) => {
    setActiveAnnotationTool(activeAnnotationTool === tool ? null : tool)
  }

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedAnnotation) return

    const updatedAnnotations = annotations.map((anno) => {
      if (anno.id === selectedAnnotation) {
        return {
          ...anno,
          comments: [
            ...anno.comments,
            {
              id: `comment-${Date.now()}`,
              author: "Admin User", // In a real app, this would be the current user
              text: newComment,
              createdAt: new Date().toISOString(),
            },
          ],
        }
      }
      return anno
    })

    setAnnotations(updatedAnnotations)
    setNewComment("")
  }

  // In a real app, this would render annotations on the document
  // For this demo, we'll just show a placeholder
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

      // Draw document
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // Draw annotations
      annotations.forEach((anno) => {
        if (anno.type === "highlight") {
          ctx.fillStyle = "rgba(255, 255, 0, 0.3)"
          ctx.fillRect(anno.position.x, anno.position.y, anno.position.width, anno.position.height)
        } else if (anno.type === "note") {
          ctx.fillStyle = "rgba(0, 0, 255, 0.7)"
          ctx.beginPath()
          ctx.arc(anno.position.x, anno.position.y, 10, 0, 2 * Math.PI)
          ctx.fill()
        }
      })
    }
  }, [annotations])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b">
          <div className="flex items-center gap-2">
            <Button
              variant={activeAnnotationTool === "highlight" ? "default" : "outline"}
              size="sm"
              onClick={() => handleAnnotationToolSelect("highlight")}
              className="flex items-center gap-1"
            >
              <Highlighter className="h-4 w-4" />
              Highlight
            </Button>
            <Button
              variant={activeAnnotationTool === "note" ? "default" : "outline"}
              size="sm"
              onClick={() => handleAnnotationToolSelect("note")}
              className="flex items-center gap-1"
            >
              <StickyNote className="h-4 w-4" />
              Add Note
            </Button>
            <Button
              variant={activeAnnotationTool === "draw" ? "default" : "outline"}
              size="sm"
              onClick={() => handleAnnotationToolSelect("draw")}
              className="flex items-center gap-1"
            >
              <Pencil className="h-4 w-4" />
              Draw
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveAnnotationTool(null)}
              className="flex items-center gap-1"
            >
              <Eraser className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>

        <div className="relative bg-gray-100 rounded-md overflow-hidden">
          <canvas ref={canvasRef} width={600} height={800} className="border shadow-lg bg-white mx-auto" />

          {/* This would be replaced with actual annotation functionality in a real app */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {activeAnnotationTool && (
              <div className="bg-black/70 text-white px-4 py-2 rounded-md">
                Click on the document to add a {activeAnnotationTool}
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <Tabs defaultValue="annotations">
          <TabsList className="w-full">
            <TabsTrigger value="annotations" className="flex-1">
              Annotations
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex-1">
              Comments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="annotations" className="mt-4 space-y-4">
            {annotations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No annotations yet. Use the tools to add annotations.
              </div>
            ) : (
              annotations.map((anno) => (
                <Card
                  key={anno.id}
                  className={`cursor-pointer ${selectedAnnotation === anno.id ? "ring-2 ring-primary" : ""}`}
                  onClick={() => setSelectedAnnotation(anno.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-1 w-3 h-3 rounded-full bg-${anno.type === "highlight" ? "yellow" : "blue"}-400`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium capitalize">{anno.type}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(anno.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {anno.text && <p className="text-sm mt-1">{anno.text}</p>}
                        <div className="flex items-center gap-1 mt-1">
                          <Avatar className="h-4 w-4">
                            <AvatarFallback className="text-[10px]">
                              {anno.author
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-xs">{anno.author}</p>
                        </div>
                        {anno.comments.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {anno.comments.length} comment{anno.comments.length !== 1 ? "s" : ""}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="comments" className="mt-4 space-y-4">
            {selectedAnnotation ? (
              <>
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {annotations
                    .find((a) => a.id === selectedAnnotation)
                    ?.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {comment.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{comment.author}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(comment.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                          <p className="text-sm mt-1">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                </div>

                <Separator />

                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>AU</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Add a comment..."
                      className="min-h-[80px]"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <div className="flex justify-end mt-2">
                      <Button
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                      >
                        <Send className="h-4 w-4" />
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Select an annotation to view or add comments.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

