const fallbackRates: Record<string, number> = {
  USD: 1,
  INR: 83.3,
  EUR: 0.92,
  GBP: 0.79,
  SGD: 1.35,
  AED: 3.67,
};

export async function getFxRates(currencies: string[]) {
  const unique = [...new Set(currencies.filter(Boolean))];

  if (unique.length === 0) {
    return fallbackRates;
  }

  try {
    const response = await fetch(
      `https://api.frankfurter.app/latest?from=USD&to=${unique.join(",")}`,
      { next: { revalidate: 3600 } },
    );

    if (!response.ok) {
      throw new Error(`FX lookup failed with ${response.status}`);
    }

    const payload = (await response.json()) as {
      rates?: Record<string, number>;
    };

    return {
      ...fallbackRates,
      ...payload.rates,
      USD: 1,
    };
  } catch {
    return fallbackRates;
  }
}
