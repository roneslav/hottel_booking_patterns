import RegisterForm from "@/components/auth/Register";

export default function RegisterPage() {
  return (
    <>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12">
        <RegisterForm />
      </main>
    </>
  );
}