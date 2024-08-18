import { useEffect } from 'react';

const useDocTitle = (title) => {
    useEffect(() => {
        if (title) {
            document.title = `${title} - FindYourGig`;
        } else {
            document.title = 'FindYourGig';
        }
    }, [title]);

    return null;
};

export default useDocTitle;
