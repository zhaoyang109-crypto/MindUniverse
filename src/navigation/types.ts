export type RootStackParamList = {
  Home: undefined;
  CategorySelect: undefined;
  AssessmentIntro: {
    categoryId: string;
    subcategoryId: string;
  };
  Assessment: {
    assessmentId: string;
    categoryId: string;
    subcategoryId: string;
  };
  Chat: {
    category?: string;
    subcategory?: string;
  };
  Journal: undefined;
  ExerciseList: undefined;
  ExercisePlayer: {
    exerciseId: string;
  };
  AssessmentList: undefined;
  BlindBox: undefined;
};
