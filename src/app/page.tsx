import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-ivory flex flex-col items-center justify-center p-6">
      <main className="max-w-md w-full text-center space-y-12">

        {/* Typographic Hero */}
        <div className="space-y-6">
          <p className="text-forest-green text-sm tracking-[0.2em] uppercase font-medium opacity-80">
            Digital Wedding Invitation
          </p>
          <h1 className="text-5xl md:text-6xl text-forest-green font-serif leading-tight">
            미니멀<br />모바일 청첩장
          </h1>
          <p className="text-forest-green/70 font-sans leading-relaxed break-keep">
            복잡한 절차 없이, 감각적인 디자인으로<br />
            소중한 분들에게 마음을 전하세요.
          </p>
        </div>

        {/* Action */}
        <div>
          <Link
            href="/builder"
            className="group inline-flex items-center gap-3 text-forest-green border-b border-forest-green pb-1 transition-all duration-300 hover:opacity-70"
          >
            <span className="text-lg font-medium">청첩장 만들기</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </main>

      {/* Footer / Copyright */}
      <footer className="absolute bottom-6 text-center">
        <p className="text-xs text-forest-green/40 uppercase tracking-widest">
          © 2024 Invitation Studio
        </p>
      </footer>
    </div>
  );
}
