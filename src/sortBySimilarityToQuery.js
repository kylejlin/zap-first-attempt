import stringSimilarity from 'string-similarity';

const sortBySimilarityToQuery = (query, array) => {
  return array.map((string) => {
    return {
      string,
      similarityToQuery: stringSimilarity.compareTwoStrings(query, string)
    }
  }).sort((a, b) => {
    return b.similarityToQuery - a.similarityToQuery;
  }).map(obj => obj.string);
};

export default sortBySimilarityToQuery;
