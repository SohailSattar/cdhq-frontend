import { addNews } from "../../../api/news/add/addNews";
import { APINewNews } from "../../../api/news/types";
import NewsForm from "../../../components/Form/NewsForm";
import { INewsFormInputs } from "../../../components/Form/types";

const CreateNewsPage = () => {
  const addNewsHandler = (values: INewsFormInputs) => {
    const params: APINewNews = {
      title: values.title!,
      shortSummary: values.shortSummary,
      thumbnail: values.thumbnail,
      newsTypeId: +values.newsType.value!,
      fullNews: values.fullNews,
    };

    addNews(params);
  };

  return (
    <div>
      <NewsForm onSubmit={addNewsHandler} />
    </div>
  );
};

export default CreateNewsPage;
