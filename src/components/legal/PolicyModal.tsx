import { POLICIES } from '../../data/legal';
import type { PolicyKey } from '../../types';
import { Modal } from '../ui/Modal';

const dateFmt = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

export const PolicyModal = ({ policy, onClose }: { policy: PolicyKey; onClose: () => void }) => {
  const { title, updated, blocks } = POLICIES[policy];

  return (
    <Modal title={title} onClose={onClose} subtitle={`Son güncelleme: ${dateFmt.format(new Date(updated))}`}>
      <article className="scroll-panel space-y-5 border-t border-line px-6 pt-5 pb-8 text-sm leading-relaxed text-slate-600">
        {blocks.map((b, i) => (
          <section key={b.heading ?? i} className="space-y-2">
            {b.heading && <h3 className="text-[0.95rem] font-semibold tracking-normal text-ink">{b.heading}</h3>}
            {b.paragraphs?.map((p) => <p key={p}>{p}</p>)}
            {b.list && (
              <ul className="space-y-1.5 pl-1">
                {b.list.map((li) => (
                  <li key={li} className="flex gap-2.5">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand" />
                    <span>{li}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </article>
    </Modal>
  );
};
