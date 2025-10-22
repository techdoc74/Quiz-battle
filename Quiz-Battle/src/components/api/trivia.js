export const fetchTriviaQuestions = async (amount = 10, category = '', difficulty = '', type = 'multiple') => {
  try {
    let url = https://opentdb.com/api.php?amount=${amount}&type=${type};
    if (category) url += &category=${category};
    if (difficulty) url += &difficulty=${difficulty};

    const response = await fetch(url);
    const data = await response.json();

    if (data.response_code === 0) {
      // Decode HTML entities (important for questions and answers)
      return data.results.map(question => ({
        ...question,
        question: decodeURIComponent(escape(question.question)),
        correct_answer: decodeURIComponent(escape(question.correct_answer)),
        incorrect_answers: question.incorrect_answers.map(ans => decodeURIComponent(escape(ans))),
      }));
    } else {
      // Handle specific response codes if necessary (e.g., no results)
      throw new Error('Could not fetch questions. Response Code: ' + data.response_code);
    }
  } catch (error) {
    console.error("Error fetching trivia questions:", error);
    throw error; // Re-throw to be caught by the component
  }
};

// Helper function for decoding HTML entities (a common issue with Open Trivia API)
function escape(html) {
  const text = document.createElement("textarea");
  text.innerHTML = html;
  return text.value;
}