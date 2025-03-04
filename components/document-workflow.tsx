"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, XCircle, Clock, ArrowRight, AlertCircle } from "lucide-react"
import { mockWorkflows } from "@/lib/mock-data"

export function DocumentWorkflow({ document }) {
  const [selectedWorkflow, setSelectedWorkflow] = useState("")
  const [comment, setComment] = useState("")
  const [activeWorkflow, setActiveWorkflow] = useState(
    document.status === "pending"
      ? {
          id: "workflow-1",
          name: "Legal Review",
          currentStep: 1,
          steps: [
            {
              id: "step-1",
              name: "Initial Review",
              approver: "John Smith",
              status: "approved",
              completedAt: new Date(Date.now() - 172800000).toISOString(),
              comment: "Looks good, moving to department review.",
            },
            {
              id: "step-2",
              name: "Department Review",
              approver: "Jennifer Lee",
              status: "pending",
              dueDate: new Date(Date.now() + 172800000).toISOString(),
            },
            {
              id: "step-3",
              name: "Final Approval",
              approver: "Michael Brown",
              status: "pending",
            },
          ],
        }
      : null,
  )

  const handleStartWorkflow = () => {
    if (!selectedWorkflow) return

    const workflow = mockWorkflows.find((w) => w.id === selectedWorkflow)
    if (!workflow) return

    // In a real app, this would call an API to start the workflow
    setActiveWorkflow({
      id: workflow.id,
      name: workflow.name,
      currentStep: 0,
      steps: workflow.steps.map((step, index) => ({
        id: `step-${index + 1}`,
        name: step.name,
        approver: step.approvers[0], // Just use the first approver for simplicity
        status: index === 0 ? "pending" : "waiting",
        dueDate: index === 0 ? new Date(Date.now() + step.timeLimit * 3600000).toISOString() : null,
      })),
    })
  }

  const handleApprove = () => {
    if (!activeWorkflow) return

    const updatedWorkflow = {
      ...activeWorkflow,
      currentStep: activeWorkflow.currentStep + 1,
      steps: activeWorkflow.steps.map((step, index) => {
        if (index === activeWorkflow.currentStep) {
          return {
            ...step,
            status: "approved",
            completedAt: new Date().toISOString(),
            comment: comment,
          }
        } else if (index === activeWorkflow.currentStep + 1) {
          return {
            ...step,
            status: "pending",
            dueDate: new Date(Date.now() + 172800000).toISOString(), // 48 hours from now
          }
        }
        return step
      }),
    }

    setActiveWorkflow(updatedWorkflow)
    setComment("")
  }

  const handleReject = () => {
    if (!activeWorkflow) return

    const updatedWorkflow = {
      ...activeWorkflow,
      steps: activeWorkflow.steps.map((step, index) => {
        if (index === activeWorkflow.currentStep) {
          return {
            ...step,
            status: "rejected",
            completedAt: new Date().toISOString(),
            comment: comment,
          }
        }
        return step
      }),
    }

    setActiveWorkflow(updatedWorkflow)
    setComment("")
  }

  const getStepIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-300" />
    }
  }

  return (
    <div className="space-y-6">
      {!activeWorkflow ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Start a New Workflow</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Workflow Template</label>
              <Select value={selectedWorkflow} onValueChange={setSelectedWorkflow}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a workflow" />
                </SelectTrigger>
                <SelectContent>
                  {mockWorkflows
                    .filter((w) => w.status === "active")
                    .map((workflow) => (
                      <SelectItem key={workflow.id} value={workflow.id}>
                        {workflow.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={handleStartWorkflow} disabled={!selectedWorkflow} className="w-full sm:w-auto">
                Start Workflow
              </Button>
            </div>
          </div>

          {selectedWorkflow && (
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">
                  {mockWorkflows.find((w) => w.id === selectedWorkflow)?.name} Workflow
                </h4>
                <div className="space-y-4">
                  {mockWorkflows
                    .find((w) => w.id === selectedWorkflow)
                    ?.steps.map((step, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-xs font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{step.name}</p>
                          <p className="text-xs text-muted-foreground">{step.approvers.join(", ")}</p>
                        </div>
                        {index < mockWorkflows.find((w) => w.id === selectedWorkflow)?.steps.length - 1 && (
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">{activeWorkflow.name} Workflow</h3>
              <p className="text-sm text-muted-foreground">
                Started on {new Date(activeWorkflow.steps[0]?.dueDate || Date.now()).toLocaleDateString()}
              </p>
            </div>

            <Badge
              className={
                activeWorkflow.steps.some((step) => step.status === "rejected")
                  ? "bg-red-100 text-red-800"
                  : activeWorkflow.currentStep >= activeWorkflow.steps.length
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
              }
            >
              {activeWorkflow.steps.some((step) => step.status === "rejected")
                ? "Rejected"
                : activeWorkflow.currentStep >= activeWorkflow.steps.length
                  ? "Completed"
                  : "In Progress"}
            </Badge>
          </div>

          <div className="space-y-4">
            {activeWorkflow.steps.map((step, index) => (
              <Card key={step.id} className={step.status === "pending" ? "ring-2 ring-yellow-200" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getStepIcon(step.status)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">
                            Step {index + 1}: {step.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-[10px]">
                                {step.approver
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <p className="text-sm">{step.approver}</p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            step.status === "approved"
                              ? "outline"
                              : step.status === "rejected"
                                ? "destructive"
                                : step.status === "pending"
                                  ? "outline"
                                  : "secondary"
                          }
                          className={
                            step.status === "approved"
                              ? "border-green-200 text-green-800"
                              : step.status === "pending"
                                ? "border-yellow-200 text-yellow-800"
                                : ""
                          }
                        >
                          {step.status === "waiting" ? "Waiting" : step.status}
                        </Badge>
                      </div>

                      {step.status === "pending" && (
                        <div className="mt-2 text-sm flex items-center gap-1 text-yellow-600">
                          <Clock className="h-4 w-4" />
                          Due by {new Date(step.dueDate).toLocaleDateString()}
                        </div>
                      )}

                      {step.comment && <div className="mt-2 p-2 bg-muted rounded-md text-sm">{step.comment}</div>}

                      {step.status === "pending" && index === activeWorkflow.currentStep && (
                        <div className="mt-4 space-y-3">
                          <Textarea
                            placeholder="Add a comment (optional)"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="flex items-center gap-1 text-red-600"
                              onClick={handleReject}
                            >
                              <XCircle className="h-4 w-4" />
                              Reject
                            </Button>
                            <Button className="flex items-center gap-1" onClick={handleApprove}>
                              <CheckCircle className="h-4 w-4" />
                              Approve
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {activeWorkflow.currentStep >= activeWorkflow.steps.length &&
            !activeWorkflow.steps.some((step) => step.status === "rejected") && (
              <div className="flex items-center justify-center p-6 bg-green-50 rounded-lg border border-green-200">
                <div className="text-center">
                  <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-2" />
                  <h3 className="text-lg font-medium text-green-800">Workflow Completed</h3>
                  <p className="text-sm text-green-600">
                    All steps have been approved. The document has been marked as approved.
                  </p>
                </div>
              </div>
            )}

          {activeWorkflow.steps.some((step) => step.status === "rejected") && (
            <div className="flex items-center justify-center p-6 bg-red-50 rounded-lg border border-red-200">
              <div className="text-center">
                <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
                <h3 className="text-lg font-medium text-red-800">Workflow Rejected</h3>
                <p className="text-sm text-red-600">The document was rejected during the approval process.</p>
                <Button variant="outline" className="mt-4">
                  Restart Workflow
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

