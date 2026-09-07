import { Instagram, Twitter, Facebook } from 'lucide-react';

const columns = [
  {
    title: 'Platform',
    links: ['Find a service', 'Browse categories', 'How it works', 'Reviews'],
  },
  {
    title: 'For professionals',
    links: ['Join as a professional', 'Business dashboard', 'Grow your business', 'Pricing'],
  },
  {
    title: 'Resources',
    links: ['Help center', 'Blog', 'FAQs', 'Contact'],
  },
  {
    title: 'Company',
    links: ['About', 'Careers', 'Privacy', 'Terms'],
  },
];

export default function Footer() {
  return (
    <footer className="bg-ink px-6 pt-20 text-paper md:px-10">
      <div className="mx-auto max-w-content">
        <div className="grid gap-14 border-b border-paper/10 pb-16 md:grid-cols-[1.4fr_2fr]">
          <div>
            <span className="font-display text-2xl italic tracking-tightest">Worksy</span>
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-paper/50">
              The neighborhood marketplace for people who do the work, and the
              people who need it done.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="text-[13px] text-paper/40">{col.title}</p>
                <ul className="mt-4 space-y-3">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        className="text-[14px] text-paper/70 transition-colors duration-300 hover:text-paper"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 py-8 text-[12px] text-paper/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Worksy. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button className="hover:text-paper/70">English (US)</button>
            <div className="flex items-center gap-4">
              <Instagram size={16} className="hover:text-paper/70" />
              <Twitter size={16} className="hover:text-paper/70" />
              <Facebook size={16} className="hover:text-paper/70" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
