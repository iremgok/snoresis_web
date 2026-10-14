import type { ChangeEvent } from 'react';
import { formatPhone, type Buyer, type BuyerErrors } from '../../lib/payment';
import { Field } from '../ui/FormField';

interface Props {
  value: Buyer;
  errors: BuyerErrors;
  onChange: (key: keyof Buyer, value: string) => void;
}

/** Teslimat ve fatura bilgileri; web ödeme modalı ile /odeme sayfası ortak kullanır. */
export const BuyerFields = ({ value, errors, onChange }: Props) => {
  const bind = (key: keyof Buyer) => ({
    name: key,
    value: value[key],
    error: errors[key],
    onChange: (e: ChangeEvent<HTMLInputElement>) =>
      onChange(key, key === 'phone' ? formatPhone(e.target.value) : e.target.value),
  });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Ad" autoComplete="given-name" {...bind('firstName')} />
        <Field label="Soyad" autoComplete="family-name" {...bind('lastName')} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="E-posta" type="email" inputMode="email" autoComplete="email" {...bind('email')} />
        <Field label="Cep telefonu" type="tel" autoComplete="tel" placeholder="05xx xxx xx xx" {...bind('phone')} />
      </div>
      <Field label="İl" autoComplete="address-level1" placeholder="Ör. İzmir" {...bind('city')} />
      <Field label="Adres" autoComplete="street-address" placeholder="Mahalle, sokak, no, ilçe" {...bind('address')} />
    </div>
  );
};
