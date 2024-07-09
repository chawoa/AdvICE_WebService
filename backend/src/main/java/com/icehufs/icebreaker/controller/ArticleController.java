package com.icehufs.icebreaker.controller;

import javax.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.icehufs.icebreaker.dto.request.article.PatchArticleRequestDto;
import com.icehufs.icebreaker.dto.request.article.PatchCommentRequestDto;
import com.icehufs.icebreaker.dto.request.article.PostArticleRequestDto;
import com.icehufs.icebreaker.dto.request.article.PostCommentRequestDto;
import com.icehufs.icebreaker.dto.response.article.CheckArticleFavoriteResponseDto;
import com.icehufs.icebreaker.dto.response.article.CheckOwnOfArticleResponseDto;
import com.icehufs.icebreaker.dto.response.article.DeleteArticleResponseDto;
import com.icehufs.icebreaker.dto.response.article.DeleteArticleAdminResponseDto;
import com.icehufs.icebreaker.dto.response.article.DeleteCommentResponseDto;
import com.icehufs.icebreaker.dto.response.article.GetArticleListResponseDto;
import com.icehufs.icebreaker.dto.response.article.GetArticleResponseDto;
import com.icehufs.icebreaker.dto.response.article.GetCommentListResponseDto;
import com.icehufs.icebreaker.dto.response.article.GetUserArticleListResponseDto;
import com.icehufs.icebreaker.dto.response.article.PatchArticleResponseDto;
import com.icehufs.icebreaker.dto.response.article.PatchCommentResponseDto;
import com.icehufs.icebreaker.dto.response.article.PostArticleResponseDto;
import com.icehufs.icebreaker.dto.response.article.PostCommentResponseDto;
import com.icehufs.icebreaker.dto.response.article.PutFavoriteResponseDto;
import com.icehufs.icebreaker.dto.response.article.PutResolvedArticleResponseDto;
import com.icehufs.icebreaker.service.ArticleService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/article")
public class ArticleController {

    private final ArticleService articleService;

    @PostMapping("")
    public ResponseEntity<? super PostArticleResponseDto> postArticle(
        @RequestBody @Valid PostArticleRequestDto requestBody,
        @AuthenticationPrincipal String email
    ){
        ResponseEntity<? super PostArticleResponseDto> response = articleService.postArticle(requestBody, email);
        return response;
    }

    @GetMapping("/{articleNum}")
    public ResponseEntity<? super GetArticleResponseDto> getArticle(
        @PathVariable Integer articleNum
    ){
        ResponseEntity<? super GetArticleResponseDto> response = articleService.getArticle(articleNum);
        return response;
    }

    @PatchMapping("/{articleNum}")
    public ResponseEntity<? super PatchArticleResponseDto> patchArticle(
        @RequestBody @Valid PatchArticleRequestDto requestBody,
        @PathVariable Integer articleNum,
        @AuthenticationPrincipal String email
    ){
        ResponseEntity<? super PatchArticleResponseDto> response = articleService.patchArticle(requestBody, articleNum, email);
        return response;
    }

    @GetMapping("/own/{articleNum}") //내가 쓴 게시글인지 확인
    public ResponseEntity<? super CheckOwnOfArticleResponseDto> checkOwnArticle(
        @PathVariable Integer articleNum,
        @AuthenticationPrincipal String email
    ){
        ResponseEntity<? super CheckOwnOfArticleResponseDto> response = articleService.checkOwnArtcle(email, articleNum);
        return response;
    }

    @GetMapping("/{articleNum}/like")
    public ResponseEntity<? super CheckArticleFavoriteResponseDto> checkFavorite(
        @PathVariable Integer articleNum,
        @AuthenticationPrincipal String email
    ){
        ResponseEntity<? super CheckArticleFavoriteResponseDto> response = articleService.checkFavorite(articleNum, email);
        return response;
    }

    @GetMapping("/list")
    public ResponseEntity<? super GetArticleListResponseDto> getArticleList(){
        ResponseEntity<? super GetArticleListResponseDto> response = articleService.getArticleList();
        return response;
    }

    @GetMapping("/user-list")
        public ResponseEntity<? super GetUserArticleListResponseDto> patchUserPass(
        @AuthenticationPrincipal String email
    ){
        ResponseEntity<? super GetUserArticleListResponseDto> response = articleService.getUserArticleList(email);
        return response;
    }

    @PutMapping("/{articleNum}/like")
    public ResponseEntity<? super PutFavoriteResponseDto> putFavorite(
        @PathVariable Integer articleNum,
        @AuthenticationPrincipal String email
    ){
        ResponseEntity<? super PutFavoriteResponseDto> response = articleService.putFavorite(articleNum, email);
        return response;
    }

    @GetMapping("/{articleNum}/comment-list")
    public ResponseEntity<? super GetCommentListResponseDto> getCommentList(
        @PathVariable Integer articleNum
    ){
        ResponseEntity<? super GetCommentListResponseDto> response = articleService.GetCommentList(articleNum);
        return response;
    }

    @DeleteMapping("/{articleNum}")
    public ResponseEntity<? super DeleteArticleResponseDto> deleteArticle(
        @PathVariable Integer articleNum,
        @AuthenticationPrincipal String email
    ){
        ResponseEntity<? super DeleteArticleResponseDto> response = articleService.deleteArticle(articleNum, email);
        return response;
    }

}

