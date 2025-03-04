export interface Document {
  id: string
  name: string
  type: string
  uploadDate: string
  size: number
  uploadedBy: string
  status: "approved" | "pending" | "rejected"
}

export const mockDocuments: Document[] = [
  {
    id: "doc-1",
    name: "Financial Report Q1 2023.pdf",
    type: "pdf",
    uploadDate: "2023-04-15T10:30:00Z",
    size: 2048,
    uploadedBy: "John Smith",
    status: "approved",
  },
  {
    id: "doc-2",
    name: "Employee Handbook.docx",
    type: "doc",
    uploadDate: "2023-05-20T14:45:00Z",
    size: 1536,
    uploadedBy: "Sarah Johnson",
    status: "approved",
  },
  {
    id: "doc-3",
    name: "Project Timeline.xlsx",
    type: "xls",
    uploadDate: "2023-06-10T09:15:00Z",
    size: 3072,
    uploadedBy: "Michael Brown",
    status: "pending",
  },
  {
    id: "doc-4",
    name: "Marketing Presentation.pptx",
    type: "doc",
    uploadDate: "2023-06-25T16:20:00Z",
    size: 4096,
    uploadedBy: "Emily Davis",
    status: "approved",
  },
  {
    id: "doc-5",
    name: "Product Mockup.png",
    type: "img",
    uploadDate: "2023-07-05T11:10:00Z",
    size: 5120,
    uploadedBy: "David Wilson",
    status: "rejected",
  },
  {
    id: "doc-6",
    name: "Client Contract.pdf",
    type: "pdf",
    uploadDate: "2023-07-12T13:25:00Z",
    size: 1024,
    uploadedBy: "Jennifer Lee",
    status: "pending",
  },
  {
    id: "doc-7",
    name: "Budget Forecast 2023.xlsx",
    type: "xls",
    uploadDate: "2023-07-18T15:40:00Z",
    size: 2560,
    uploadedBy: "Robert Taylor",
    status: "approved",
  },
  {
    id: "doc-8",
    name: "Office Layout.jpg",
    type: "img",
    uploadDate: "2023-07-22T10:05:00Z",
    size: 3584,
    uploadedBy: "Lisa Anderson",
    status: "approved",
  },
  {
    id: "doc-9",
    name: "Meeting Minutes.docx",
    type: "doc",
    uploadDate: "2023-07-28T09:30:00Z",
    size: 768,
    uploadedBy: "Kevin Martin",
    status: "pending",
  },
  {
    id: "doc-10",
    name: "Annual Report 2022.pdf",
    type: "pdf",
    uploadDate: "2023-08-01T14:15:00Z",
    size: 4608,
    uploadedBy: "Amanda White",
    status: "approved",
  },
  {
    id: "doc-11",
    name: "Customer Survey Results.xlsx",
    type: "xls",
    uploadDate: "2023-08-05T16:50:00Z",
    size: 1280,
    uploadedBy: "Daniel Thompson",
    status: "rejected",
  },
  {
    id: "doc-12",
    name: "Product Catalog.pdf",
    type: "pdf",
    uploadDate: "2023-08-10T11:20:00Z",
    size: 6144,
    uploadedBy: "Michelle Garcia",
    status: "approved",
  },
]

export interface Workflow {
  id: string
  name: string
  type: string
  description: string
  createdAt: string
  status: "active" | "draft"
  steps: WorkflowStep[]
}

export interface WorkflowStep {
  id: string
  name: string
  approvers: string[]
  timeLimit: number
  requireAllApprovers: boolean
  notifyOnCompletion: boolean
}

export const mockWorkflows: Workflow[] = [
  {
    id: "workflow-1",
    name: "Legal Document Approval",
    type: "approval",
    description: "Workflow for legal document review and approval",
    createdAt: "2023-06-15T10:30:00Z",
    status: "active",
    steps: [
      {
        id: "step-1",
        name: "Initial Review",
        approvers: ["John Smith"],
        timeLimit: 48,
        requireAllApprovers: false,
        notifyOnCompletion: true,
      },
      {
        id: "step-2",
        name: "Legal Department",
        approvers: ["Jennifer Lee", "Michael Brown"],
        timeLimit: 72,
        requireAllApprovers: true,
        notifyOnCompletion: true,
      },
      {
        id: "step-3",
        name: "Final Approval",
        approvers: ["Sarah Johnson"],
        timeLimit: 24,
        requireAllApprovers: false,
        notifyOnCompletion: true,
      },
    ],
  },
  {
    id: "workflow-2",
    name: "Finance Approval",
    type: "approval",
    description: "Workflow for financial document review and approval",
    createdAt: "2023-07-10T14:45:00Z",
    status: "active",
    steps: [
      {
        id: "step-1",
        name: "Department Review",
        approvers: ["Michael Brown"],
        timeLimit: 48,
        requireAllApprovers: false,
        notifyOnCompletion: true,
      },
      {
        id: "step-2",
        name: "Finance Department",
        approvers: ["Amanda White", "Robert Taylor"],
        timeLimit: 72,
        requireAllApprovers: true,
        notifyOnCompletion: true,
      },
    ],
  },
  {
    id: "workflow-3",
    name: "Project Approval",
    type: "sequential",
    description: "Sequential workflow for project document approval",
    createdAt: "2023-08-05T09:15:00Z",
    status: "draft",
    steps: [
      {
        id: "step-1",
        name: "Team Lead Review",
        approvers: ["Emily Davis"],
        timeLimit: 24,
        requireAllApprovers: false,
        notifyOnCompletion: true,
      },
      {
        id: "step-2",
        name: "Project Manager",
        approvers: ["David Wilson"],
        timeLimit: 48,
        requireAllApprovers: false,
        notifyOnCompletion: true,
      },
      {
        id: "step-3",
        name: "Department Head",
        approvers: ["Sarah Johnson"],
        timeLimit: 72,
        requireAllApprovers: false,
        notifyOnCompletion: true,
      },
    ],
  },
]

