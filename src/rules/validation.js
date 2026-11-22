// Checkout form validation. Returns an object of { fieldName: message }.
export const NOTES_MAX = 140;

export function normalisePhone(raw) {
  return raw.replace(/[\s-]/g, '');
}

export function validateCheckout(values, fulfilment) {
  const errors = {};

  const name = values.fullName.trim();
  if (!name) {
    errors.fullName = 'Enter a name for the order.';
  } else if (name.length < 2) {
    errors.fullName = 'The name needs at least 2 characters.';
  } else if (!/^[\p{L}][\p{L} .'-]*$/u.test(name)) {
    errors.fullName = 'Use letters only. Spaces, full stops, apostrophes and hyphens are allowed.';
  }

  const phone = normalisePhone(values.phone);
  if (!phone) {
    errors.phone = 'Enter a mobile number so the kitchen can reach you.';
  } else if (!/^(\+92|0)3\d{9}$/.test(phone)) {
    errors.phone = 'Use a Pakistani mobile number like 0300 1234567 or +92 300 1234567.';
  }

  if (fulfilment === 'delivery' && values.address.trim().length < 10) {
    errors.address = 'Enter the full delivery address (at least 10 characters): house, street and sector.';
  }

  if (!values.slot) {
    errors.slot = 'Choose a time slot.';
  }

  if (values.notes.length > NOTES_MAX) {
    errors.notes = `Notes can be at most ${NOTES_MAX} characters (currently ${values.notes.length}).`;
  }

  return errors;
}
