// Format the source's exact decimal string for display only. Six-place ties
// round away from zero; no source value is converted through floating point.
export function formatRatio(value) {
 const exact = typeof value === 'string' ? value
  : typeof value === 'bigint' ? String(value)
  : typeof value === 'number' && Number.isSafeInteger(value) ? (Object.is(value, -0) ? '-0' : String(value))
  : null;
 if (exact === null || exact === '') return 'Unavailable';
 const match = /^([+-]?)(\d+)(?:\.(\d+))?$/.exec(exact);
 if (!match) return 'Unavailable';
 const [, sign, whole, fraction = ''] = match;
 let scaled = BigInt(whole) * 1000000n + BigInt((fraction + '000000').slice(0, 6));
 if (fraction.length > 6 && fraction[6] >= '5') scaled += 1n;
 const integer = scaled / 1000000n;
 const decimals = String(scaled % 1000000n).padStart(6, '0');
 return `${sign === '-' ? '-' : ''}${integer}.${decimals}`;
}
