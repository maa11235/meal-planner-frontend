export async function fetchMealPlan(mealType) {
  const response = await fetch("/generate-meal-plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ meal_type: mealType }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch meal plan");
  }

  return response.json();
}