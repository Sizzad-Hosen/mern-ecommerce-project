"use client";
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import CardProduct from '@/components/CardProduct';
import CardLoading from '@/components/CardLoading';
import SummaryApi from '@/common/SummaryApi';
import AxiosToastError from '@/utilis/AxiosToastError';
import Axios from '@/utilis/Axios';

const SearchPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const loadingArrayCard = new Array(10).fill(null);

  // Fetch search term from query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get('search');
    if (searchQuery) {
      setSearchText(searchQuery);
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.searchProduct,
        data: {
          search: searchText,
          page: page,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setData((prev) => [...prev, ...responseData.data]);
        setTotalPage(responseData.totalPage);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, searchText]);

  const handleFetchMore = () => {
    if (totalPage > page) {
      setPage((prev) => prev + 1);
    }
  };

  // Filter data based on searchText
  const filteredData = data.filter((product) =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <section className="bg-white">
      <div className="container mx-auto p-4">
        <p className="font-semibold">Search Results: {filteredData.length}</p>

        <InfiniteScroll
          dataLength={filteredData.length}
          hasMore={filteredData.length < totalPage}
          next={handleFetchMore}
          loader={<CardLoading />}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 py-4 gap-4">
            {filteredData.map((product, index) => (
              <CardProduct key={product._id + index} data={product} />
            ))}
          </div>
        </InfiniteScroll>

        {/* No data found */}
        {!loading && filteredData.length === 0 && (
          <div className="flex flex-col justify-center items-center w-full mx-auto">
            <p className="font-semibold my-2">No Data found</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchPage;
