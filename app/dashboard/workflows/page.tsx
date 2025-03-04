"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Edit, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { mockWorkflows } from "@/lib/mock-data"
import { WorkflowCreator } from "@/components/workflow-creator"

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState(mockWorkflows)
  const [activeTab, setActiveTab] = useState("all")
  const [isCreatingWorkflow, setIsCreatingWorkflow] = useState(false)

  const filteredWorkflows = workflows.filter((workflow) => {
    if (activeTab === "all") return true
    if (activeTab === "active") return workflow.status === "active"
    if (activeTab === "draft") return workflow.status === "draft"
    return true
  })

  const handleCreateWorkflow = (newWorkflow) => {
    setWorkflows([
      ...workflows,
      {
        ...newWorkflow,
        id: `workflow-${workflows.length + 1}`,
        createdAt: new Date().toISOString(),
        status: "draft",
      },
    ])
    setIsCreatingWorkflow(false)
  }

  const handleDeleteWorkflow = (id) => {
    setWorkflows(workflows.filter((workflow) => workflow.id !== id))
  }

  const handleActivateWorkflow = (id) => {
    setWorkflows(workflows.map((workflow) => (workflow.id === id ? { ...workflow, status: "active" } : workflow)))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">Workflow Management</h1>
        <Dialog open={isCreatingWorkflow} onOpenChange={setIsCreatingWorkflow}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Workflow
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Workflow</DialogTitle>
              <DialogDescription>
                Define a new document approval workflow with multiple steps and approvers.
              </DialogDescription>
            </DialogHeader>
            <WorkflowCreator onSave={handleCreateWorkflow} onCancel={() => setIsCreatingWorkflow(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Workflows</CardTitle>
          <CardDescription>Create and manage document approval workflows for your organization.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Workflows</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
            </TabsList>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Steps</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWorkflows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No workflows found. Create your first workflow to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredWorkflows.map((workflow) => (
                      <TableRow key={workflow.id}>
                        <TableCell className="font-medium">{workflow.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {workflow.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{workflow.steps.length}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              workflow.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {workflow.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(workflow.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {workflow.status === "draft" && (
                              <Button variant="outline" size="sm" onClick={() => handleActivateWorkflow(workflow.id)}>
                                Activate
                              </Button>
                            )}
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500"
                              onClick={() => handleDeleteWorkflow(workflow.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Workflow Assignments</CardTitle>
          <CardDescription>Documents currently in workflow processes</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Workflow</TableHead>
                <TableHead>Current Step</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Financial Report Q1 2023.pdf</TableCell>
                <TableCell>
                  <Badge variant="outline">Finance Approval</Badge>
                </TableCell>
                <TableCell>Department Review</TableCell>
                <TableCell>John Smith</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-yellow-600">
                    Due in 2 days
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    View Document
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Client Contract.pdf</TableCell>
                <TableCell>
                  <Badge variant="outline">Legal Review</Badge>
                </TableCell>
                <TableCell>Legal Department</TableCell>
                <TableCell>Jennifer Lee</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-red-600">
                    Overdue by 1 day
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    View Document
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Project Timeline.xlsx</TableCell>
                <TableCell>
                  <Badge variant="outline">Project Approval</Badge>
                </TableCell>
                <TableCell>Manager Review</TableCell>
                <TableCell>Michael Brown</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-green-600">
                    Due in 5 days
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    View Document
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

