export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">Afribase</h1>
      <p className="text-gray-400">Welcome to Africa's business platform.</p>
      <div className="mt-8 flex gap-4">
        <a
          href="/auth/sign-in"
          className="px-6 py-2 bg-brand-primary rounded-full font-medium"
        >
          Sign In
        </a>
        <a
          href="/auth/sign-up"
          className="px-6 py-2 border border-white/20 rounded-full font-medium"
        >
          Sign Up
        </a>
      </div>
    </div>
  );
}
