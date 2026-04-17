import type { DealershipInfo } from '../api/schemas'

interface FooterBlockProps {
  dealership: DealershipInfo
}

export function FooterBlock({ dealership }: FooterBlockProps): JSX.Element {
  return (
    <footer
      className="bg-slate-900 border-t border-slate-700 py-10 px-8"
      data-testid="footer-block"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 gap-8 md:grid-cols-3 text-center md:text-left">
        {/* Contact */}
        <div>
          <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">Contact Us</h3>
          <p className="text-2xl text-blue-400 font-semibold">{dealership.phone}</p>
          <p className="text-lg text-slate-400 mt-2">{dealership.address}</p>
        </div>

        {/* Hours */}
        <div className="md:col-span-2">
          <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">Hours</h3>
          <ul className="space-y-2">
            {dealership.hours.map((entry, idx) => (
              <li key={idx} className="flex justify-center md:justify-start gap-6 text-lg">
                <span className="text-slate-300 font-medium w-40">{entry.days}</span>
                <span className="text-slate-400">{entry.hours}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
