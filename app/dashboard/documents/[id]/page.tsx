"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DocumentViewer } from "@/components/document-viewer"
import { DocumentAnnotations } from "@/components/document-annotations"
import { DocumentWorkflow } from "@/components/document-workflow"
import { mockDocuments } from "@/lib/mock-data"
import {
  ArrowLeft,
  Download,
  Share,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  History,
  MessageSquare,
  Users,
} from "lucide-react"

export default function DocumentDetailsPage({ params }) {
  const router = useRouter()
  const { id } = params
  const [document, setDocument] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("preview")

  useEffect(() => {
    // In a real app, this would fetch from an API
    const doc = mockDocuments.find((doc) => doc.id === id)
    if (doc) {
      setDocument(doc)
    }
    setLoading(false)
  }, [id])

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading document...</div>
  }

  if (!document) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Documents
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold">Document Not Found</h2>
            <p className="text-muted-foreground">The document you're looking for doesn't exist or has been removed.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejected":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Button variant="ghost" onClick={() => router.back()} className="self-start flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Documents
        </Button>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Share className="h-4 w-4" />
            Share
          </Button>
          <Button>Start Workflow</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{document.name}</CardTitle>
                  <CardDescription>
                    Uploaded on {new Date(document.uploadDate).toLocaleDateString()} by {document.uploadedBy}
                  </CardDescription>
                </div>
                <Badge
                  className={
                    document.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : document.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }
                >
                  <div className="flex items-center gap-1">
                    {getStatusIcon(document.status)}
                    <span className="capitalize">{document.status}</span>
                  </div>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="preview" className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    Preview
                  </TabsTrigger>
                  <TabsTrigger value="annotations" className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    Annotations
                  </TabsTrigger>
                  <TabsTrigger value="workflow" className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Workflow
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex items-center gap-1">
                    <History className="h-4 w-4" />
                    History
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="preview" className="m-0">
                  <DocumentViewer document={document} />
                </TabsContent>

                <TabsContent value="annotations" className="m-0">
                  <DocumentAnnotations document={document} />
                </TabsContent>

                <TabsContent value="workflow" className="m-0">
                  <DocumentWorkflow document={document} />
                </TabsContent>

                <TabsContent value="history" className="m-0">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 pb-3 border-b">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>JS</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">John Smith uploaded this document</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(document.uploadDate).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pb-3 border-b">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>SJ</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Sarah Johnson viewed this document</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(Date.now() - 86400000).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pb-3 border-b">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>MB</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Michael Brown added an annotation</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(Date.now() - 172800000).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">File Type</h4>
                <Badge variant="outline" className="uppercase">
                  {document.type}
                </Badge>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Size</h4>
                <p className="text-sm">{(document.size / 1024).toFixed(2)} KB</p>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-1">Current Workflow</h4>
                {document.status === "pending" ? (
                  <div className="space-y-2">
                    <Badge className="bg-yellow-100 text-yellow-800">Legal Review</Badge>
                    <p className="text-sm">Step 2 of 3: Department Approval</p>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>JL</AvatarFallback>
                      </Avatar>
                      <p className="text-sm">Awaiting Jennifer Lee's approval</p>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Due in 2 days
                    </p>
                  </div>
                ) : document.status === "approved" ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <p className="text-sm">Workflow completed</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <p className="text-sm">No active workflow</p>
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-1">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Finance</Badge>
                  <Badge variant="secondary">Report</Badge>
                  <Badge variant="secondary">Q1</Badge>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Access</h4>
                <div className="flex -space-x-2">
                  <Avatar className="h-6 w-6 border-2 border-background">
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-6 w-6 border-2 border-background">
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-6 w-6 border-2 border-background">
                    <AvatarFallback>MB</AvatarFallback>
                  </Avatar>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                    +3
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Related Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Financial Report Q4 2022.pdf</p>
                  <p className="text-xs text-muted-foreground">Uploaded 6 months ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Budget Forecast 2023.xlsx</p>
                  <p className="text-xs text-muted-foreground">Uploaded 2 months ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

