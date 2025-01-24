import { Metadata } from "next";
// components
import { InstanceSignInForm } from "@/components/login";
// layouts
import { DefaultLayout } from "@/layouts/default-layout";

export const metadata: Metadata = {
  title: "Nexio | Simple, extensible, project management tool.",
  description:
    "Project management tool to manage issues, sprints, and product roadmaps with peace of mind.",
  openGraph: {
    title: "Nexio | Simple, extensible, project management tool.",
    description:
      "Project management tool to manage issues, sprints, and product roadmaps with peace of mind.",
    url: "#",
  },
  keywords:
    "software development, customer feedback, software, accelerate, code management, release management, project management, issue tracking, agile, scrum, kanban, collaboration",
  twitter: {
    site: "@planepowers",
  },
};

export default async function LoginPage() {
  return (
    <DefaultLayout>
      <InstanceSignInForm />
    </DefaultLayout>
  );
}
