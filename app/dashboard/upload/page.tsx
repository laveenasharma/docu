"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X, CheckCircle, AlertCircle, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

type UploadStatus = "idle" | "uploading" | "success" | "error" | "pending"

interface UploadFile {
  id: string
  name: string
  size: number
  type: string
  progress: number
  status: UploadStatus
  error?: string
}

export default function UploadPage() {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [documentType, setDocumentType] = useState("")
  const [description, setDescription] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: "idle" as UploadStatus,
      }))
      setFiles([...files, ...newFiles])
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).map((file) => ({
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: "idle" as UploadStatus,
      }))
      setFiles([...files, ...newFiles])
    }
  }

  const removeFile = (id: string) => {
    setFiles(files.filter((file) => file.id !== id))
  }

  const uploadFiles = () => {
    if (files.length === 0) return

    // Update all files to uploading status
    setFiles(
      files.map((file) => ({
        ...file,
        status: "uploading",
        progress: 0,
      })),
    )

    // Simulate upload progress for each file
    files.forEach((file) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 10

        if (progress >= 100) {
          clearInterval(interval)
          progress = 100

          // Randomly assign a final status
          const finalStatus: UploadStatus =
            Math.random() > 0.2 ? (Math.random() > 0.3 ? "success" : "pending") : "error"

          setFiles((prevFiles) =>
            prevFiles.map((f) =>
              f.id === file.id
                ? {
                    ...f,
                    progress,
                    status: finalStatus,
                    error: finalStatus === "error" ? "Server error occurred" : undefined,
                  }
                : f,
            ),
          )
        } else {
          setFiles((prevFiles) => prevFiles.map((f) => (f.id === file.id ? { ...f, progress } : f)))
        }
      }, 300)
    })
  }

  const getStatusIcon = (status: UploadStatus) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Upload Documents</h1>

      <Card>
        <CardHeader>
          <CardTitle>Document Information</CardTitle>
          <CardDescription>Enter details about the document you are uploading</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="documentType">Document Type</Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger id="documentType">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="doc">Word Document</SelectItem>
                  <SelectItem value="xls">Excel Spreadsheet</SelectItem>
                  <SelectItem value="img">Image</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter a description for this document"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label>Upload Files</Label>
              <div
                className="border-2 border-dashed rounded-md p-4 sm:p-6 text-center cursor-pointer hover:bg-gray-50"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Drag and drop files here, or click to select files</p>
                <p className="text-xs text-gray-400 mt-1">Supports PDF, Word, Excel, and image files up to 10MB</p>
                <Input ref={fileInputRef} type="file" className="hidden" multiple onChange={handleFileChange} />
              </div>
            </div>
          </div>

          {files.length > 0 && (
            <div className="space-y-3 mt-4">
              <Label>Files to Upload</Label>
              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className={cn(
                      "flex flex-col sm:flex-row sm:items-center p-3 border rounded-md",
                      file.status === "error" && "border-red-200 bg-red-50",
                      file.status === "success" && "border-green-200 bg-green-50",
                      file.status === "pending" && "border-yellow-200 bg-yellow-50",
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        {file.status !== "idle" && <div className="ml-2 sm:hidden">{getStatusIcon(file.status)}</div>}
                      </div>
                      <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                      {file.status === "uploading" && <Progress value={file.progress} className="h-1 mt-2" />}
                      {file.status === "error" && file.error && (
                        <p className="text-xs text-red-500 mt-1">{file.error}</p>
                      )}
                      {file.status === "pending" && <p className="text-xs text-yellow-500 mt-1">Awaiting approval</p>}
                    </div>
                    <div className="flex items-center gap-2 mt-2 sm:mt-0 sm:ml-4">
                      {file.status !== "idle" && <div className="hidden sm:block">{getStatusIcon(file.status)}</div>}
                      {file.status === "idle" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeFile(file.id)
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
          <Button variant="outline" onClick={() => setFiles([])} className="w-full sm:w-auto">
            Clear All
          </Button>
          <Button onClick={uploadFiles} disabled={files.length === 0} className="w-full sm:w-auto">
            Upload {files.length > 0 && `(${files.length})`}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

