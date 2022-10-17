import { useLocation } from "react-router";
function Search() {
  const location = useLocation(); // 지금 있는 곳에 관한 정보
  const keyword = new URLSearchParams(location.search).get("keyword");
  console.log(keyword);
  return null;
}
export default Search;
