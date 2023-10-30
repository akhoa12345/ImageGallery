// import { useState, useEffect } from 'react'
// import './App.css'
// import axios from 'axios';

// function App() {
//   const [input, setInput] = useState('')
//   const [images, setImages] = useState([])
//   const [page, setPage] = useState(1); // Current page number
//   const [hasMore, setHasMore] = useState(true); // Flag to check if there are more photos



//   // function fetchRequest() {
//   //   axios.get(`https://api.unsplash.com/photos/`, {
//   //     params: {
//   //       page: '1',
//   //       per_page: '50',
//   //       query: input,
//   //       client_id: 'ePFpH5rEhqUbSkHB-2sg-BjRfaGcMk5FgjyZzaGjJec'
//   //     },

//   //   })
//   //     .then(function (response) {
//   //       console.log(response);
//   //       setImages(response.data);
//   //     })
//   //     .catch(function (error) {
//   //       console.log(error);
//   //     })
//   //     .finally(function () {
//   //       // always executed
//   //     });
//   // }

//   // useEffect(() => {
//   //   fetchRequest()
//   // }, [])

//   const fetchRequest = async () => {
//     const Access_Key = 'ePFpH5rEhqUbSkHB-2sg-BjRfaGcMk5FgjyZzaGjJec'
//     // let inputText = input === '' ? null : ('&query=$'+input)
//     // let inputText 
//     // if(input === '') {
//     //   inputText = `&query=${input}`
//     // }
//     // else {
//     //   inputText = `&query=${input}`
//     // }

//     // const inputText = input === '' ? '' : `&query=${input}`;
//     // const inputText = input !== '' ? `&query=${input}` : '';
//     const data = await fetch(

//       `https://api.unsplash.com/search/photos?page=${page}&query=${input}&client_id=${Access_Key}&per_page=50`
//     );
//     const dataJ = await data.json();
//     const result = dataJ.results;
//     if (result.length === 0) {
//       setHasMore(false);
//     } else {
//       // Append new photos to the existing images
//       setImages((prevImages) => [...prevImages, ...result]);
//       setPage(page + 1); // Increment the page number
//     }
//     console.log(result);

//   };

//   useEffect(() => {
//     const handleScroll = () => {
//       if (
//         window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
//         hasMore
//       ) {
//         // You can adjust the value (100) to control when the new data loads.
//         fetchRequest();
//       }
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//     };
//   }, [hasMore]);

//   const Submit = () => {
//     fetchRequest();
//     setInput("");
//   };

//   return (
//     <div className="app">
//       <div className='search'>
//         <input
//           type="text"
//           placeholder="Search Anything..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//         />
//         <button
//           type='submit'
//           onClick={Submit}
//         >
//           Search
//         </button>
//       </div>
//       <h2>Image Gallery</h2>
//       <div className='image-gallery'>
//         {images.map((image) => {
//           return (
//             <div className="image-card" key={image.id}>
//               <img src={image.urls.thumb} alt={image.alt_description} />
//             </div>
//           )
//         })}
//       </div>
//     </div>
//   )
// }

// export default App

// src/components/ImageSearch.js
// src/components/PhotoGallery.js
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './App.css'

const App = () => {
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New state for loading indicator
  const API_KEY = 'gl7PtwGaVnHY7vYoIpznO92FsOCRBBlRj5Qm_W6TCcQ'; // Your Unsplash API Key

  const handleImageFetch = async (page) => {
    try {
      setIsLoading(true); // Show loading indicator
      const response = await axios.get(
        `https://api.unsplash.com/photos/?page=${page}`,
        {
          headers: {
            Authorization: `Client-ID ${API_KEY}`,
          },
        }
      );

      if (response.status === 200) {
        setResults((prevResults) => [...prevResults, ...response.data]);
        setIsFetching(false);
        setIsLoading(false); // Hide loading indicator when data is received
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      setIsLoading(false); // Hide loading indicator in case of an error
    }
  };

  const handleSearch = async (page, query) => {
    try {
      setIsLoading(true); // Show loading indicator
      const response = await axios.get(
        `https://api.unsplash.com/search/photos?page=${page}&query=${query}`,
        {
          headers: {
            Authorization: `Client-ID ${API_KEY}`,
          },
        }
      );

      if (response.status === 200) {
        setResults((prevResults) => [...prevResults, ...response.data.results]);
        setIsFetching(false);
        setIsLoading(false); // Hide loading indicator when data is received
      }
    } catch (error) {
      console.error('Error searching for images:', error);
      setIsLoading(false); // Hide loading indicator in case of an error
    }
  };

  const scrollHandler = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      setIsFetching(true);
    }
  };

  const searchImages = () => {
    setResults([]);
    setCurrentPage(1);
    handleSearch(1, searchText);
  };

  useEffect(() => {
    window.addEventListener('scroll', scrollHandler);
    return () => window.removeEventListener('scroll', scrollHandler);
  }, []);

  useEffect(() => {
    if (isFetching) {
      setCurrentPage((prevPage) => prevPage + 1);
      if (searchText) {
        handleSearch(currentPage, searchText);
      } else {
        handleImageFetch(currentPage);
      }
    }
  }, [isFetching, searchText, currentPage]);

  // Load initial images on the first render
  useEffect(() => {
    handleImageFetch(currentPage);
  }, []);

  return (
    <div>
      <h1>Image Gallery</h1>
      <div className='search-container'>
        <input
          type="text"
          placeholder="Search for images..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button onClick={searchImages}>Search</button>
      </div>
      <div className='photo-container'>
        {results.map((image) => (
          <div className='photo-card' key={image.id}>
            <img src={image.urls.thumb} alt={image.alt_description} />
          </div>
        ))}
      </div>
      {isLoading && <div className='loading-indicator'>Loading...</div>} {/* Loading indicator */}
    </div>
  );
};

export default App;
