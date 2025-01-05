import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getGroupedSnippets } from "@/lib/snippets";

import type { SnippetParams } from "./[name]/page";
import { formatLanguage, toTitleCase } from "@/lib/utils";

export async function generateMetadata({
  params,
}: SnippetParams): Promise<Metadata> {
  const { language, category } = await params;

  const title = `${toTitleCase(category)} - SnipNest`;
  const description = `Snippets in the ${toTitleCase(
    category,
  )} category of ${formatLanguage(language)}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function SnippetCategoryPage({ params }: SnippetParams) {
  const { language, category } = await params;

  const groupedSnippets = await getGroupedSnippets();
  const snippetsOfCategory = groupedSnippets[language][category];

  if (!snippetsOfCategory) {
    notFound();
  }

  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
      {snippetsOfCategory.map((snippet) => (
        <Link
          className="w-full bg-card rounded-md border border-border"
          href={`/snippets/${language}/${category}/${snippet.name}`}
          key={snippet.metadata.name}
        >
          <div className="p-4 flex flex-col gap-1">
            <h1 className="font-medium text-lg">{snippet.metadata.name}</h1>
            <p className="text-sm text-muted-foreground line-clamp-2 w-full">
              {snippet.metadata.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
