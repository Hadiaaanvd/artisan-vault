import React from "react";
import { render, screen } from "@testing-library/react";
import { useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import Artwork from "./artwork";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    id: "1",
  }),
  useNavigate: () => jest.fn(),
}));

const artworkData = {
  id: "1",
  image: "artwork-image.jpg",
  name: "Artwork Title",
  collection: "Artwork Collection",
  price: "1000",
  description: "Artwork Description",
  artist: {
    image: "artist-image.jpg",
    displayName: "Artist Name",
    about: "Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum",
  },
};

const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe("Artwork Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    (useSelector as unknown as jest.Mock).mockReturnValue([artworkData]);
    renderWithRouter(<Artwork />);
    expect(screen.getByText("About the Artist")).toBeInTheDocument();
  });

  it("displays artwork information when provided", async () => {
    (useSelector as unknown as jest.Mock).mockReturnValue([artworkData]);
    renderWithRouter(<Artwork />);
    expect(screen.getByText(artworkData.name)).toBeInTheDocument();
    expect(screen.getByText(artworkData.collection)).toBeInTheDocument();
    expect(screen.getByText(artworkData.price)).toBeInTheDocument();
    expect(screen.getByText(artworkData.description)).toBeInTheDocument();
    expect(
      screen.getByText(artworkData.artist.displayName)
    ).toBeInTheDocument();
    expect(screen.getByAltText(artworkData.name)).toHaveAttribute(
      "src",
      artworkData.image
    );
  });

  it("navigates to other artwork in the collection when clicked", async () => {
    const additionalArtwork = {
      ...artworkData,
      id: "2",
      name: "Other Artwork",
    };
    (useSelector as unknown as jest.Mock).mockReturnValue([
      artworkData,
      additionalArtwork,
    ]);

    renderWithRouter(<Artwork />);
    expect(screen.getByText(additionalArtwork.name)).toBeInTheDocument();
  });
});
