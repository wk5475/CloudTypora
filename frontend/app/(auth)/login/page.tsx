import { LogIn } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-6 text-ink">
      <section className="w-full max-w-sm space-y-6">
        <div>
          <p className="text-sm font-medium text-moss">CloudTypora</p>
          <h1 className="mt-2 text-3xl font-semibold">登录</h1>
        </div>
        <form className="space-y-4">
          <label className="block text-sm font-medium">
            邮箱
            <input
              className="mt-2 w-full rounded-md border border-line bg-white px-3 py-2 outline-none focus:border-moss"
              name="email"
              type="email"
              autoComplete="email"
            />
          </label>
          <label className="block text-sm font-medium">
            密码
            <input
              className="mt-2 w-full rounded-md border border-line bg-white px-3 py-2 outline-none focus:border-moss"
              name="password"
              type="password"
              autoComplete="current-password"
            />
          </label>
          <button
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-medium text-white"
            type="submit"
          >
            <LogIn size={16} aria-hidden />
            进入工作台
          </button>
        </form>
      </section>
    </main>
  );
}
