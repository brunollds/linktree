import { Check, Copy } from 'lucide-react';
import { brandLinks } from '../data/site';
import { trackEvent } from '../lib/analytics';
import { copyText, useCopiedFlag } from '../lib/clipboard';
import CouponSheet from './CouponSheet';

export type SheetName = 'magalu' | 'yesstyle' | 'shein';

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MagaluCoupon {
  code: string;
  discount: string;
  minimumPurchase: string;
}

interface SheinCampaign {
  title: string;
  detail: string;
  code: string;
}

export const YESSTYLE_CODE = 'CECILIA010';
export const SHEIN_CODE = '4CW5Y';

const sheinCampaigns: SheinCampaign[] = [
  {
    title: 'Produtos selecionados',
    detail: 'Descontos por tempo limitado',
    code: '37S3442',
  },
  {
    title: '50% para novos usuários',
    detail: 'Só para contas novas elegíveis',
    code: 'G326U6B',
  },
];

const magaluCoupons: MagaluCoupon[] = [
  { code: '10EMCASACOMCECILIA', discount: 'R$ 10 OFF', minimumPurchase: 'R$ 499,90' },
  { code: '20EMCASACOMCECILIA', discount: 'R$ 20 OFF', minimumPurchase: 'R$ 999,90' },
  { code: '30EMCASACOMCECILIA', discount: 'R$ 30 OFF', minimumPurchase: 'R$ 1.499,90' },
  { code: '40EMCASACOMCECILIA', discount: 'R$ 40 OFF', minimumPurchase: 'R$ 1.999,90' },
  { code: '50EMCASACOMCECILIA', discount: 'R$ 50 OFF', minimumPurchase: 'R$ 2.499,90' },
  { code: '60EMCASACOMCECILIA', discount: 'R$ 60 OFF', minimumPurchase: 'R$ 2.999,90' },
  { code: '70EMCASACOMCECILIA', discount: 'R$ 70 OFF', minimumPurchase: 'R$ 3.499,90' },
  { code: '80EMCASACOMCECILIA', discount: 'R$ 80 OFF', minimumPurchase: 'R$ 3.999,90' },
  { code: '90EMCASACOMCECILIA', discount: 'R$ 90 OFF', minimumPurchase: 'R$ 4.499,90' },
  { code: '100EMCASACOMCECILIA', discount: 'R$ 100 OFF', minimumPurchase: 'R$ 4.999,90' },
];

function CopyButton({ code, onCopied }: { code: string; onCopied?: () => void }) {
  const [copied, setCopied] = useCopiedFlag();

  const handleCopy = async () => {
    await copyText(code);
    setCopied(true);
    onCopied?.();
  };

  return (
    <button type="button" className="sheet-copy" onClick={handleCopy} aria-label={`Copiar ${code}`}>
      {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
      {copied ? 'Copiado' : 'Copiar'}
    </button>
  );
}

export function MagaluSheet({ isOpen, onClose }: SheetProps) {
  return (
    <CouponSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Meus cupons na Magalu"
      storeHref={brandLinks.magalu}
      storeLabel="Abrir minha loja na Magalu"
      onStoreClick={() => trackEvent('click_magalu_store', { link_url: brandLinks.magalu })}
    >
      <p className="sheet-note">
        Estes cupons funcionam só na minha loja Magazine Você. No app ou no site comum da Magalu
        eles não são aceitos.
      </p>
      <ul className="sheet-list">
        {magaluCoupons.map((coupon) => (
          <li key={coupon.code} className="sheet-row">
            <span className="sheet-row-title">{coupon.discount}</span>
            <span className="sheet-row-detail">
              Compras acima de {coupon.minimumPurchase.replace(' ', ' ')}
            </span>
            <span className="sheet-row-code">{coupon.code}</span>
            <CopyButton
              code={coupon.code}
              onCopied={() => trackEvent('copy_magalu_coupon', { coupon_code: coupon.code })}
            />
          </li>
        ))}
      </ul>
    </CouponSheet>
  );
}

export function YesStyleSheet({ isOpen, onClose }: SheetProps) {
  return (
    <CouponSheet
      isOpen={isOpen}
      onClose={onClose}
      title="CECILIA010 é um Reward Code"
      storeHref={brandLinks.yesStyle}
      storeLabel="Ir para a YesStyle"
      onStoreClick={() =>
        trackEvent('click_coupon_store', { partner: 'YesStyle', link_url: brandLinks.yesStyle })
      }
    >
      <p className="sheet-note">
        Ele não vai no campo de cupom. Por isso dá para somar com os cupons promocionais da loja.
      </p>
      <div className="sheet-row">
        <span className="sheet-row-title">{YESSTYLE_CODE}</span>
        <span className="sheet-row-detail">Até 5% extra: 5% na 1ª compra, 2% nas seguintes</span>
        <CopyButton
          code={YESSTYLE_CODE}
          onCopied={() =>
            trackEvent('copy_coupon', { coupon_code: YESSTYLE_CODE, partner: 'YesStyle' })
          }
        />
      </div>
      <ol className="sheet-steps">
        <li>Copie o código {YESSTYLE_CODE}.</li>
        <li>
          No carrinho da YesStyle, cole no campo <strong>Reward Code</strong>.
        </li>
        <li>
          Se tiver um cupom da loja, use no campo <strong>Coupon Code</strong>. Os dois descontos
          somam.
        </li>
      </ol>
    </CouponSheet>
  );
}

export function SheinSheet({ isOpen, onClose }: SheetProps) {
  const trackCopy = (code: string) =>
    trackEvent('copy_coupon', { coupon_code: code, partner: 'SHEIN' });

  return (
    <CouponSheet
      isOpen={isOpen}
      onClose={onClose}
      title={`${SHEIN_CODE} é um código de indicação`}
      storeHref={brandLinks.shein}
      storeLabel="Ir para a SHEIN"
      onStoreClick={() =>
        trackEvent('click_coupon_store', { partner: 'SHEIN', link_url: brandLinks.shein })
      }
    >
      <p className="sheet-note">
        Os códigos da SHEIN não vão no campo de cupom: você pesquisa o código na busca do
        aplicativo. As condições variam por conta e por campanha.
      </p>
      <ul className="sheet-list">
        <li className="sheet-row">
          <span className="sheet-row-title">Indicação da Cecília</span>
          <span className="sheet-row-detail">Condições aparecem na sua conta</span>
          <span className="sheet-row-code">{SHEIN_CODE}</span>
          <CopyButton code={SHEIN_CODE} onCopied={() => trackCopy(SHEIN_CODE)} />
        </li>
        {sheinCampaigns.map((campaign) => (
          <li key={campaign.code} className="sheet-row">
            <span className="sheet-row-title">{campaign.title}</span>
            <span className="sheet-row-detail">{campaign.detail}</span>
            <span className="sheet-row-code">{campaign.code}</span>
            <CopyButton code={campaign.code} onCopied={() => trackCopy(campaign.code)} />
          </li>
        ))}
      </ul>
      <ol className="sheet-steps">
        <li>Copie o código que quiser usar.</li>
        <li>No aplicativo da SHEIN, cole o código na busca.</li>
        <li>Confira as condições e o valor final antes de pagar.</li>
      </ol>
    </CouponSheet>
  );
}
