import { MessageCircle, Phone } from "lucide-react";
import { company } from "@/data/company";
import { whatsappContactUrl } from "@/lib/whatsapp";
import { Action } from "../../ui/Action";

/**
 * Contact: a TANTY yellow band whose top edge curves the opposite way to the
 * footer's (a hollow instead of a dome), a centred call to action and its two
 * buttons, WhatsApp and phone. Addresses and other lines live in the footer.
 */
export function Commander() {
  return (
    <section id="contact" aria-labelledby="nid-order-title" className="nid-on-yellow relative scroll-mt-20 pb-12 pt-20 lg:pb-16 lg:pt-28">
      {/* Top edge: the footer's curve, inverted (dips in the middle) */}
      <svg
        viewBox="0 0 1440 64"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
        className="nid-deco pointer-events-none absolute inset-x-0 bottom-[calc(100%-1px)] block h-10 w-full lg:h-16"
      >
        <path d="M0 24Q720 88 1440 24V64H0Z" fill="var(--nid-yellow)" />
      </svg>
      <div className="nid-wrap">
        <div className="mx-auto max-w-[60rem] text-center">
          <h2 data-reveal="" id="nid-order-title" className="nid-title">
            Nous <span className="nid-accent nid-swoosh">contacter</span><span className="nid-dot">.</span>
          </h2>
          <p data-reveal="" className="nid-lead mx-auto mt-6 max-w-[38rem]">
            Notre service client répond à vos questions et prend vos commandes sur WhatsApp ou par téléphone.
          </p>
          <div data-reveal="" className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Action href={whatsappContactUrl()}>
              <MessageCircle aria-hidden="true" className="size-5" />
              Écrire sur WhatsApp
            </Action>
            <Action href={`tel:${company.phone.e164}`} variant="outline" className="nid-num">
              <Phone aria-hidden="true" className="size-5" />
              {company.phone.display}
            </Action>
          </div>
        </div>
      </div>
    </section>
  );
}
