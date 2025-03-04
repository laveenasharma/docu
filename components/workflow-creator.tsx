"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle, Trash2, ArrowDown, Clock, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

export function WorkflowCreator({ onSave, onCancel }) {
  const [workflowName, setWorkflowName] = useState("")
  const [workflowType, setWorkflowType] = useState("approval")
  const [workflowDescription, setWorkflowDescription] = useState("")
  const [steps, setSteps] = useState([
    {
      id: "step-1",
      name: "Initial Review",
      approvers: [],
      timeLimit: 48,
      requireAllApprovers: false,
      notifyOnCompletion: true,
    },
  ])

  const addStep = () => {
    const newStep = {
      id: `step-${steps.length + 1}`,
      name: `Step ${steps.length + 1}`,
      approvers: [],
      timeLimit: 48,
      requireAllApprovers: false,
      notifyOnCompletion: true,
    }
    setSteps([...steps, newStep])
  }

  const removeStep = (stepId) => {
    if (steps.length > 1) {
      setSteps(steps.filter((step) => step.id !== stepId))
    }
  }

  const updateStep = (stepId, field, value) => {
    setSteps(steps.map((step) => (step.id === stepId ? { ...step, [field]: value } : step)))
  }

  const handleAddApprover = (stepId, approver) => {
    setSteps(
      steps.map((step) => {
        if (step.id === stepId) {
          return {
            ...step,
            approvers: [...step.approvers, approver],
          }
        }
        return step
      }),
    )
  }

  const handleRemoveApprover = (stepId, approverToRemove) => {
    setSteps(
      steps.map((step) => {
        if (step.id === stepId) {
          return {
            ...step,
            approvers: step.approvers.filter((approver) => approver !== approverToRemove),
          }
        }
        return step
      }),
    )
  }

  const handleSave = () => {
    const workflow = {
      name: workflowName,
      type: workflowType,
      description: workflowDescription,
      steps: steps,
    }
    onSave(workflow)
  }

  // Mock users for approver selection
  const availableApprovers = [
    "John Smith",
    "Sarah Johnson",
    "Michael Brown",
    "Emily Davis",
    "David Wilson",
    "Jennifer Lee",
    "Robert Taylor",
    "Lisa Anderson",
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="workflow-name">Workflow Name</Label>
          <Input
            id="workflow-name"
            placeholder="e.g., Legal Document Approval"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="workflow-type">Workflow Type</Label>
          <Select value={workflowType} onValueChange={setWorkflowType}>
            <SelectTrigger id="workflow-type">
              <SelectValue placeholder="Select workflow type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="approval">Approval Workflow</SelectItem>
              <SelectItem value="review">Review Workflow</SelectItem>
              <SelectItem value="sequential">Sequential Review</SelectItem>
              <SelectItem value="parallel">Parallel Approval</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="workflow-description">Description</Label>
          <Textarea
            id="workflow-description"
            placeholder="Describe the purpose of this workflow"
            value={workflowDescription}
            onChange={(e) => setWorkflowDescription(e.target.value)}
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Workflow Steps</h3>
          <Button onClick={addStep} variant="outline" size="sm" className="flex items-center gap-1">
            <PlusCircle className="h-4 w-4" />
            Add Step
          </Button>
        </div>

        <div className="space-y-6">
          {steps.map((step, index) => (
            <Card key={step.id} className="relative">
              <CardContent className="pt-6">
                <div className="absolute -top-3 left-4">
                  <Badge className="bg-primary">{index + 1}</Badge>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`step-name-${step.id}`}>Step Name</Label>
                    <Input
                      id={`step-name-${step.id}`}
                      value={step.name}
                      onChange={(e) => updateStep(step.id, "name", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`time-limit-${step.id}`}>Time Limit (hours)</Label>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id={`time-limit-${step.id}`}
                        type="number"
                        value={step.timeLimit}
                        onChange={(e) => updateStep(step.id, "timeLimit", Number.parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label>Approvers</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {step.approvers.length === 0 ? (
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          No approvers assigned
                        </div>
                      ) : (
                        step.approvers.map((approver) => (
                          <Badge key={approver} variant="secondary" className="flex items-center gap-1">
                            {approver}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 ml-1 hover:bg-transparent"
                              onClick={() => handleRemoveApprover(step.id, approver)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))
                      )}
                    </div>
                    <Select onValueChange={(value) => handleAddApprover(step.id, value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Add approver" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableApprovers
                          .filter((approver) => !step.approvers.includes(approver))
                          .map((approver) => (
                            <SelectItem key={approver} value={approver}>
                              {approver}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`require-all-${step.id}`}
                      checked={step.requireAllApprovers}
                      onCheckedChange={(checked) => updateStep(step.id, "requireAllApprovers", checked)}
                    />
                    <Label htmlFor={`require-all-${step.id}`}>Require all approvers</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`notify-${step.id}`}
                      checked={step.notifyOnCompletion}
                      onCheckedChange={(checked) => updateStep(step.id, "notifyOnCompletion", checked)}
                    />
                    <Label htmlFor={`notify-${step.id}`}>Notify on completion</Label>
                  </div>
                </div>

                {steps.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-red-500"
                    onClick={() => removeStep(step.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardContent>

              {index < steps.length - 1 && (
                <div className="flex justify-center my-2">
                  <ArrowDown className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!workflowName || steps.some((step) => step.approvers.length === 0)}>
          Save Workflow
        </Button>
      </div>
    </div>
  )
}

