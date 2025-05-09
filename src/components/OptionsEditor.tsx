export const OptionsEditor = ({
  options,
  setOptions,
  showOptionsEditor,
  setShowOptionsEditor,
}: {
  options: string;
  setOptions: (options: string) => void;
  showOptionsEditor: boolean;
  setShowOptionsEditor: (showOptionsEditor: boolean) => void;
}) => {
  if (showOptionsEditor) {
    return (
      <>
        <h2 className="text-xl font-bold mt-4 mb-0">GTFS-to-blocks Options</h2>
        <a
          href="https://github.com/BlinkTagInc/gtfs-to-blocks"
          target="_blank"
          className="text-sm"
        >
          View Documentation
        </a>
        <textarea
          className="w-full p-2 mt-2 border border-gray-300 rounded-sm h-[600px]"
          value={options}
          onChange={(e) => setOptions(e.target.value)}
        />
      </>
    );
  }

  return (
    <button
      type="button"
      className="no-style"
      onClick={() => setShowOptionsEditor(true)}
    >
      Customize Options
    </button>
  );
};
