"use client"

import { mockDocuments } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Eye, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export function RecentDocuments() {
  // Get the 5 most recent documents
  const recentDocuments = [...mockDocuments]
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-4">
      {recentDocuments.map((doc) => (
        <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-medium truncate">{doc.name}</h3>
              <Badge
                className={
                  doc.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : doc.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }
              >
                {doc.status}
              </Badge>
            </div>
            <p className="text-xs text-gray-500">
              Uploaded by {doc.uploadedBy} on {new Date(doc.uploadDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button variant="ghost" size="icon" title="View">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Download">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

