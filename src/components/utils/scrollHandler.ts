// utils/scrollHelper.ts
export const scrollToFirstError = (errors: Record<string, any>) => {
  const errorFields = Object.keys(errors);
  if (!errorFields.length) return;

  const sorted = errorFields.sort((a, b) => {
    const elA = document.querySelector(`[name="${a}"]`);
    const elB = document.querySelector(`[name="${b}"]`);
    if (!elA || !elB) return 0;
    return elA.getBoundingClientRect().top - elB.getBoundingClientRect().top;
  });

  const firstField = sorted[0];
  const input = document.querySelector(`[name="${firstField}"]`);
  const parent = input?.closest('div') || input;

  if (parent) {
    const yOffset = -120;
    const y = parent.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
    (input as HTMLElement)?.focus();
    parent.classList.add('ring-2', 'ring-red-500', 'animate-pulse');
    setTimeout(() => parent.classList.remove('ring-2', 'ring-red-500', 'animate-pulse'), 2000);
  }
};
