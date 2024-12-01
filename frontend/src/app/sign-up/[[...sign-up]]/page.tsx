import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background-light to-surface-light dark:from-background-dark dark:to-surface-dark">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-primary-light dark:bg-primary-dark hover:opacity-90",
            card: "bg-surface-light dark:bg-surface-dark",
            headerTitle: "text-secondary-light dark:text-secondary-dark",
            headerSubtitle: "text-secondary-light dark:text-secondary-dark",
            socialButtonsBlockButton:
              "text-secondary-light dark:text-secondary-dark border-border-light dark:border-border-dark",
            dividerLine: "bg-border-light dark:bg-border-dark",
            dividerText: "text-secondary-light dark:text-secondary-dark",
            formFieldLabel: "text-secondary-light dark:text-secondary-dark",
            formFieldInput:
              "bg-background-light dark:bg-background-dark text-secondary-light dark:text-secondary-dark border-border-light dark:border-border-dark",
            footerActionLink: "text-primary-light dark:text-primary-dark",
          },
        }}
      />
    </div>
  );
}
