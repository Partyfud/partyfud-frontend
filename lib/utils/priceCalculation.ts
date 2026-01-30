/**
 * Calculate dish price based on guest count and serves_people
 * If serves_people is set: calculate servings needed (ceil) and multiply by dish price
 * If serves_people is null: use current behavior (price * guest_count)
 * 
 * @param dishPrice - The base price of the dish
 * @param servesPeople - Optional number of people this dish serves
 * @param guestCount - Number of guests selected by user
 * @returns Calculated price for the dish
 */
export const calculateDishPriceForGuests = (
  dishPrice: number,
  servesPeople: number | null | undefined,
  guestCount: number
): number => {
  if (servesPeople && servesPeople > 0) {
    // Calculate servings needed: ceil(guest_count / serves_people)
    // If guest_count < serves_people, treat as 1 serving
    const servings = guestCount <= servesPeople ? 1 : Math.ceil(guestCount / servesPeople);
    return dishPrice * servings;
  } else {
    // Fallback to current behavior: price * guest_count
    return dishPrice * guestCount;
  }
};
