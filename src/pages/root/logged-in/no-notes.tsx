import { NOTE_CONSTS } from "@/config/site";

type Props = {
  search: string | undefined,
  categoryChosen: typeof NOTE_CONSTS.categories[number] | undefined
}

const NoNotes: React.FC<Props> = ({
  search,
  categoryChosen
}) => (
  <div>
    You currently have no note or no note exists on the filter you provided.
    <br />
    <br />
    {search && (
      <div>
        Currently Searched Keyword:
        <br />
        {search}
      </div>
    )}
    <br />
    <br />

    {categoryChosen && (
      <div>
        Currently chosen category:
        <br />
        {categoryChosen}
      </div>
    )}
    <br />
    <br />
    Create one now by clicking on the pencil icon below &quot;My Notes&quot;.
  </div>
);

export default NoNotes;