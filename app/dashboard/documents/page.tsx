"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Search,
  Filter,
  MoreVertical,
  ArrowUpDown,
  Download,
  Eye,
  Trash,
  X,
  Maximize2,
  Minimize2,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { mockDocuments } from "@/lib/mock-data"
import { InlineDocumentViewer } from "@/components/inline-document-viewer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"

export default function DocumentsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [documentType, setDocumentType] = useState("all")
  const [sortField, setSortField] = useState("uploadDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [isMobile, setIsMobile] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeTab, setActiveTab] = useState("view")
  const [annotations, setAnnotations] = useState([])

  // Load selected document from session storage on initial render
  useEffect(() => {
    const storedDocId = sessionStorage.getItem("selectedDocumentId")
    if (storedDocId) {
      const doc = mockDocuments.find((doc) => doc.id === storedDocId)
      if (doc) {
        setSelectedDocument(doc)

        // Load annotations from session storage
        const storedAnnotations = sessionStorage.getItem(`annotations-${storedDocId}`)
        if (storedAnnotations) {
          setAnnotations(JSON.parse(storedAnnotations))
        }
      }
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Save selected document to session storage when it changes
  useEffect(() => {
    if (selectedDocument) {
      sessionStorage.setItem("selectedDocumentId", selectedDocument.id)

      // Save annotations to session storage
      if (annotations.length > 0) {
        sessionStorage.setItem(`annotations-${selectedDocument.id}`, JSON.stringify(annotations))
      }
    } else {
      sessionStorage.removeItem("selectedDocumentId")
    }
  }, [selectedDocument, annotations])

  // Filter and sort documents
  const filteredDocuments = mockDocuments
    .filter((doc) => {
      // Filter by search query
      const matchesSearch =
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase())

      // Filter by document type
      const matchesType = documentType === "all" || doc.type === documentType

      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      // Sort by selected field
      if (sortField === "name") {
        return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      } else if (sortField === "uploadDate") {
        return sortDirection === "asc"
          ? new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
          : new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
      } else if (sortField === "size") {
        return sortDirection === "asc" ? a.size - b.size : b.size - a.size
      }
      return 0
    })

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleViewDocument = (document) => {
    setSelectedDocument(document)
    setActiveTab("view")
  }

  const handleCloseViewer = () => {
    setSelectedDocument(null)
    setIsFullscreen(false)
  }

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleAddAnnotation = (annotation) => {
    const newAnnotation = {
      ...annotation,
      id: `anno-${Date.now()}`,
      createdAt: new Date().toISOString(),
      author: "Admin User",
    }

    setAnnotations([...annotations, newAnnotation])
  }

  const handleViewDetails = (document) => {
    router.push(`/dashboard/documents/${document.id}`)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className={`space-y-6 ${isFullscreen ? "h-screen overflow-hidden" : ""}`}>
      {!isFullscreen && (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Documents</h1>
            <Button>Export List</Button>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Filter Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <Select value={documentType} onValueChange={setDocumentType}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Document Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="doc">Word Document</SelectItem>
                      <SelectItem value="xls">Excel Spreadsheet</SelectItem>
                      <SelectItem value="img">Image</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-gray-500" />
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <Select value={sortField} onValueChange={setSortField}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort By" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="uploadDate">Upload Date</SelectItem>
                        <SelectItem value="size">Size</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                    >
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {selectedDocument ? (
        <Card className={`${isFullscreen ? "fixed inset-0 z-50 rounded-none" : ""}`}>
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={handleCloseViewer}>
                <X className="h-4 w-4" />
              </Button>
              <div>
                <h2 className="text-lg font-medium">{selectedDocument.name}</h2>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="uppercase">
                    {selectedDocument.type}
                  </Badge>
                  <Badge
                    className={
                      selectedDocument.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : selectedDocument.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }
                  >
                    <div className="flex items-center gap-1">
                      {getStatusIcon(selectedDocument.status)}
                      <span className="capitalize">{selectedDocument.status}</span>
                    </div>
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handleToggleFullscreen}>
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
              <Button onClick={() => handleViewDetails(selectedDocument)}>View Details</Button>
            </div>
          </div>

          <div className="p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="view">View Document</TabsTrigger>
                <TabsTrigger value="annotate">Annotate</TabsTrigger>
                <TabsTrigger value="info">Document Info</TabsTrigger>
              </TabsList>

              <TabsContent value="view" className="m-0">
                <InlineDocumentViewer
                  document={selectedDocument}
                  annotations={annotations}
                  isFullscreen={isFullscreen}
                  readOnly={true}
                />
              </TabsContent>

              <TabsContent value="annotate" className="m-0">
                <InlineDocumentViewer
                  document={selectedDocument}
                  annotations={annotations}
                  onAddAnnotation={handleAddAnnotation}
                  isFullscreen={isFullscreen}
                  readOnly={false}
                />
              </TabsContent>

              <TabsContent value="info" className="m-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">File Details</h3>
                      <Separator className="my-2" />
                      <dl className="grid grid-cols-2 gap-2 text-sm">
                        <dt className="font-medium">Name:</dt>
                        <dd>{selectedDocument.name}</dd>
                        <dt className="font-medium">Type:</dt>
                        <dd className="uppercase">{selectedDocument.type}</dd>
                        <dt className="font-medium">Size:</dt>
                        <dd>{(selectedDocument.size / 1024).toFixed(2)} KB</dd>
                        <dt className="font-medium">Uploaded:</dt>
                        <dd>{new Date(selectedDocument.uploadDate).toLocaleDateString()}</dd>
                        <dt className="font-medium">Uploaded By:</dt>
                        <dd>{selectedDocument.uploadedBy}</dd>
                      </dl>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Workflow Status</h3>
                      <Separator className="my-2" />
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            selectedDocument.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : selectedDocument.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }
                        >
                          <div className="flex items-center gap-1">
                            {getStatusIcon(selectedDocument.status)}
                            <span className="capitalize">{selectedDocument.status}</span>
                          </div>
                        </Badge>

                        {selectedDocument.status === "pending" && (
                          <span className="text-sm text-yellow-600">Awaiting approval</span>
                        )}

                        {selectedDocument.status === "approved" && (
                          <span className="text-sm text-green-600">Approved on {new Date().toLocaleDateString()}</span>
                        )}

                        {selectedDocument.status === "rejected" && (
                          <span className="text-sm text-red-600">Rejected on {new Date().toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Annotations</h3>
                      <Separator className="my-2" />
                      {annotations.length === 0 ? (
                        <p className="text-sm text-gray-500">No annotations added yet.</p>
                      ) : (
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                          {annotations.map((anno) => (
                            <div key={anno.id} className="border rounded-md p-2 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="font-medium capitalize">{anno.type}</span>
                                <span className="text-xs text-gray-500">
                                  {new Date(anno.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              {anno.text && <p className="mt-1">{anno.text}</p>}
                              <p className="text-xs text-gray-500 mt-1">Added by {anno.author}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            {isMobile ? (
              // Mobile card view
              <div className="divide-y">
                {filteredDocuments.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">No documents found matching your criteria</div>
                ) : (
                  filteredDocuments.map((document) => (
                    <div key={document.id} className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{document.name}</h3>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewDocument(document)}>
                              <Eye className="mr-2 h-4 w-4" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" /> Download
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="uppercase">
                          {document.type}
                        </Badge>
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
                      <div className="text-sm text-gray-500">
                        <div>Size: {(document.size / 1024).toFixed(2)} KB</div>
                        <div>Uploaded: {new Date(document.uploadDate).toLocaleDateString()}</div>
                        <div>By: {document.uploadedBy}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              // Desktop table view
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">
                      <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("name")}>
                        Name
                        {sortField === "name" && <span className="ml-2">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                      </Button>
                    </TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>
                      <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("uploadDate")}>
                        Upload Date
                        {sortField === "uploadDate" && (
                          <span className="ml-2">{sortDirection === "asc" ? "↑" : "↓"}</span>
                        )}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("size")}>
                        Size
                        {sortField === "size" && <span className="ml-2">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                      </Button>
                    </TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        No documents found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDocuments.map((document) => (
                      <TableRow key={document.id}>
                        <TableCell className="font-medium">{document.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="uppercase">
                            {document.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(document.uploadDate).toLocaleDateString()}</TableCell>
                        <TableCell>{(document.size / 1024).toFixed(2)} KB</TableCell>
                        <TableCell>{document.uploadedBy}</TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleViewDocument(document)}>
                              <Eye className="h-4 w-4 mr-1" /> View
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleViewDetails(document)}>
                                  <Eye className="mr-2 h-4 w-4" /> View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="mr-2 h-4 w-4" /> Download
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Trash className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

