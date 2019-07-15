import React, {useEffect, useState} from 'react';
import axios from 'axios';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import useConstant from 'use-constant';
import useAsync from 'react-async-hook';


const useDataApi = (initialUrl, initialData) => {
    const [data, setData] = useState(initialData);
    const [url, setUrl] = useState(initialUrl);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsError(false);
            setIsLoading(true);

            try {
                const result = await axios(url);

                setData(result.data);
            } catch (error) {
                setIsError(true);
            }

            setIsLoading(false);
        };

        fetchData();
    }, [url]);

    return [{ data, isLoading, isError }, setUrl];
};


const useSearchStarwarsHero = () => {
    // Handle the input text state
    const [inputText, setInputText] = useState('');

    // Debounce the original search async function
    const debouncedSearchStarwarsHero = useConstant(() =>
        AwesomeDebouncePromise(searchStarwarsHero, 300)
    );

    const search = useAsync(
        async text => {
            if (text.length === 0) {
                return [];
            } else {
                return debouncedSearchStarwarsHero(text);
            }
        },
        // Ensure a new request is made everytime the text changes (even if it's debounced)
        [inputText]
    );

    // Return everything needed for the hook consumer
    return {
        inputText,
        setInputText,
        search,
    };
};

const DisplayData = props => {
    const [query, setQuery] = useState('redux');
    const [{data, isLoading, isError}, doFetch] = useDataApi(
        'http://hn.algolia.com/api/v1/search?query=redux',
        { hits: [] },
    );

    // const debounce = (e) => {
    //     console.log(e.target.value);
    //     return _.debounce(() => {
    //         setQuery(e.target.value)
    //     }, 1);
    // };

    const debounce = _.debounce(fireServerEvent, 500);

    function fireServerEvent(e){
        console.log(e.target.value);
        setQuery(e.target.value)
    }

    useEffect(() => {
        doFetch(`http://hn.algolia.com/api/v1/search?query=${query}`);
    }, [query]);

    return (
        <div>
            <input type={'text'} onChange={e=>debounce(e)}/>
            {isError && <div>Something went wrong ...</div>}

            {isLoading ? (
                <div>Loading ...</div>
            ) : (
                <ul>
                    {data.hits.map(item => (
                        <li key={item.objectID}>
                            <a href={item.url}>{item.title}</a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DisplayData;
