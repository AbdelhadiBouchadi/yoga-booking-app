import { getCategories } from "@/app/data/admin/category-actions";
import CreateLessonForm from "@/components/admin/lessons/CreateLessonForm";
import { getInstructors } from "../../instructors/actions";

export default async function CreateLessonPage() {
  const [categories, instructors] = await Promise.all([
    getCategories(),
    getInstructors(),
  ]);

  return (
    <>
      <div className="space-y-2 text-center">
        <h1 className="text-foreground text-3xl font-bold">
          Create New Lesson
        </h1>
        <p className="text-muted-foreground">
          Fill in the details below to create a new lesson session
        </p>
      </div>
      <CreateLessonForm
        initialCategories={categories}
        initialInstructors={instructors}
      />
    </>
  );
}
