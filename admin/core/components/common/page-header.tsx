"use client";

type TPageHeader = {
  title?: string;
  description?: string;
};

export const PageHeader: React.FC<TPageHeader> = (props) => {
  const { title = "God Mode - Nexio", description = "Nexio god mode" } = props;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
    </>
  );
};
