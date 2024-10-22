document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
  
    searchInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        handleSearch();
      }
    });
  
    const handleSearch = () => {
      const query = searchInput.value.trim();
      if (query) {
        alert(`Searching for: ${query}`);
        // Perform the search operation (e.g., redirect to search results page)
      }
    };
  });
  