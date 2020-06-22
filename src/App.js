import React, { useState, useCallback, useRef } from "react";
import useSearchHook from "./useSearchHook";

function App() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const { books, loading, hasMore, error } = useSearchHook(query, pageNumber);

  const observer = useRef();
  const lastElemRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleQuery = (e) => {
    setQuery(e.target.value);
    setPageNumber(1);
  };

  return (
    <div className="App">
      <input type="text" value={query} onChange={handleQuery} />
      {books.map((book, idx) => {
        if (idx + 1 === books.length) {
          return (
            <div ref={lastElemRef} key={book}>
              {book}
            </div>
          );
        } else {
          return <div key={book}>{book}</div>;
        }
      })}
      {loading && <h3>Loading...</h3>}
      {error && <h3>Error</h3>}
    </div>
  );
}

export default App;
